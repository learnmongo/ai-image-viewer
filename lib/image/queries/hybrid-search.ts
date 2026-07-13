import {
  getCollection,
  DEFAULT_LIMIT,
  DEFAULT_SEARCH_INDEX,
  DEFAULT_VECTOR_INDEX,
  DEFAULT_HYBRID_NUM_CANDIDATES,
  DEFAULT_HYBRID_BRANCH_LIMIT,
  DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY,
  DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST,
  DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE,
} from './base';
import { embedSearchQuery } from '@/lib/image/voyage-embed-query';
import { ATLAS_TEXT_SEARCH_PATHS } from './text-search-paths';
import { ImageDoc } from '@/types/image';

/**
 * Hybrid: `$rankFusion` (vector + text), then filter by real vector similarity.
 * Vague queries often still “win” with weak neighbors — we require the **best** window score
 * to clear a bar, plus per-doc floor and gap-from-best, or we return nothing.
 *
 * Terms used below:
 * - `RRF` (Reciprocal Rank Fusion): a rank-merging method used by `$rankFusion`. It blends
 *   result order from multiple pipelines (vector + text here) into one combined rank.
 * - `ANN` (Approximate Nearest Neighbors): the fast nearest-neighbor strategy used by
 *   `$vectorSearch`. We tune ANN breadth with `numCandidates`.
 */

const EMBED_MODEL =
  process.env.VOYAGE_EMBED_MODEL ?? process.env.VOYAGE_EMBEDDING_MODEL ?? 'voyage-4';

/** Parse positive integer env values (used for ANN breadth / branch limits). */
function num(envKey: string, fallback: number): number {
  const raw = process.env[envKey];
  if (raw == null || raw === '') return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Parse similarity-like env values in (0, 1].
 * Returns `0` for invalid/disabled values so caller logic can treat that rule as "off".
 */
function sim(envKey: string, fallback: number): number {
  const raw = process.env[envKey];
  if (raw == null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(1, n);
}

function toNum(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export async function searchImagesHybrid(
  query: string,
  limit: number = DEFAULT_LIMIT,
  textIndex: string = DEFAULT_SEARCH_INDEX,
  vectorIndex: string = DEFAULT_VECTOR_INDEX
): Promise<(ImageDoc & { score: number })[]> {
  const q = query?.trim() ?? '';
  if (!q) return [];

  const queryVector = await embedSearchQuery(q, EMBED_MODEL);
  const col = await getCollection();

  const numCandidates = Math.min(2048, Math.max(32, num('HYBRID_NUM_CANDIDATES', DEFAULT_HYBRID_NUM_CANDIDATES)));
  const branchLimit = Math.min(150, Math.max(16, num('HYBRID_BRANCH_LIMIT', DEFAULT_HYBRID_BRANCH_LIMIT)));
  const minVectorSim = sim('HYBRID_MIN_VECTOR_SIMILARITY', DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY);
  const maxGapFromBest = sim('HYBRID_VECTOR_MAX_GAP_FROM_BEST', DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST);
  const minBestVector = sim('HYBRID_MIN_BEST_VECTOR_SCORE', DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE);

  const overfetch = Math.min(100, Math.max(limit * 4, 24));

  // Pipeline A: fetch raw vector similarity (`vectorSearchScore`) per `_id`
  // so we can quality-filter the fused results afterward.
  const vectorSimilarityLookupPipeline = [
    {
      $vectorSearch: {
        index: vectorIndex,
        path: 'embedding',
        queryVector,
        numCandidates,
        limit: branchLimit,
      },
    },
    { $addFields: { _vectorSearchSim: { $meta: 'vectorSearchScore' } } },
    { $project: { _id: 1, _vectorSearchSim: 1 } },
  ];

  // Pipeline B: hybrid ranking from vector + text.
  // `$meta: 'score'` here is the `$rankFusion` combined score (RRF combined rank score),
  // not the raw vector cosine similarity.
  const hybridFusionPipeline = [
    {
      $rankFusion: {
        input: {
          pipelines: {
            vectorPipeline: [
              {
                $vectorSearch: {
                  index: vectorIndex,
                  path: 'embedding',
                  queryVector,
                  numCandidates,
                  limit: branchLimit,
                },
              },
            ],
            fullTextPipeline: [
              {
                $search: {
                  index: textIndex,
                  text: {
                    query: q,
                    path: [...ATLAS_TEXT_SEARCH_PATHS],
                  },
                },
              },
              { $limit: branchLimit },
            ],
          },
        },
        combination: {
          weights: { vectorPipeline: 0.5, fullTextPipeline: 0.5 },
        },
        scoreDetails: true,
      },
    },
    { $addFields: { score: { $meta: 'score' } } },
    { $limit: overfetch },
  ];

  // Run both in parallel:
  // - similarityRows -> quality signals from vector similarity
  // - fusedRows -> final hybrid rank candidates from rank fusion
  const [similarityRows, fusedRows] = await Promise.all([
    col
      .aggregate<{ _id: ImageDoc['_id']; _vectorSearchSim?: unknown }>(vectorSimilarityLookupPipeline)
      .toArray(),
    col.aggregate<ImageDoc & { score?: unknown }>(hybridFusionPipeline).toArray(),
  ]);

  const vectorSimilarityById = new Map<string, number>();
  for (const row of similarityRows) {
    const s = toNum(row._vectorSearchSim);
    if (s !== undefined) vectorSimilarityById.set(String(row._id), s);
  }

  // Best vector score in this query window.
  // If even the top candidate is weak, we treat the whole query as weak.
  const bestVectorSimilarity =
    similarityRows.length === 0
      ? 0
      : Math.max(...similarityRows.map((r) => toNum(r._vectorSearchSim) ?? 0));

  // Weakest-query guard: if nothing in the corpus is clearly similar, don’t fill the UI.
  if (minBestVector > 0 && bestVectorSimilarity < minBestVector) {
    return [];
  }

  const filteredFused = fusedRows.filter((doc) => {
    const v = vectorSimilarityById.get(String(doc._id));
    if (v === undefined) return false;
    if (minVectorSim > 0 && v < minVectorSim) return false;
    if (maxGapFromBest > 0 && bestVectorSimilarity > 0 && v < bestVectorSimilarity - maxGapFromBest) return false;
    return true;
  });

  // Final order after passing quality gates:
  // prioritize stronger semantic neighbors (higher `vectorSearchScore`) first.
  filteredFused.sort(
    (a, b) =>
      (vectorSimilarityById.get(String(b._id)) ?? 0) - (vectorSimilarityById.get(String(a._id)) ?? 0),
  );

  return filteredFused.slice(0, limit).map((doc) => ({
    ...(doc as ImageDoc),
    score: toNum(doc.score) ?? 0,
  }));
}
