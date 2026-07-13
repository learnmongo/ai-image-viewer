import { Collection } from 'mongodb';
import clientPromise from '../../mongo';
import { ImageDoc } from '@/types/image';

/**
 * MongoDB database and collection configuration.
 * Set MONGO_DATABASE and MONGO_COLLECTION in .env.local (or deploy env).
 */
const databaseName = process.env.MONGO_DATABASE;
const collectionName = process.env.MONGO_COLLECTION;
if (!databaseName) {
  throw new Error(
    'Missing MONGO_DATABASE: set it in .env.local (e.g. MONGO_DATABASE=seevector).'
  );
}
if (!collectionName) {
  throw new Error(
    'Missing MONGO_COLLECTION: set it in .env.local (e.g. MONGO_COLLECTION=images).'
  );
}
export const DATABASE_NAME = databaseName;
export const COLLECTION_NAME = collectionName;

/** Default row cap for `searchImages` / `searchImagesHybrid` when `limit` is omitted. */
export const DEFAULT_LIMIT = 25;

/** Search index name passed to `$search.index` (must exist in Atlas for this collection). */
export const DEFAULT_SEARCH_INDEX = 'ix_text';

/** Vector index name passed to `$vectorSearch.index` on field `embedding`. Env: `MONGODB_VECTOR_INDEX`. */
export const DEFAULT_VECTOR_INDEX =
  process.env.MONGODB_VECTOR_INDEX ?? 'vector_index';

/** Fuzzy color queries only — unrelated to search pipelines above. */
export const DEFAULT_COLOR_THRESHOLD = 60;

/**
 * Hybrid search tuned for small catalogs (~100 docs): smaller ANN fan-out and branch caps.
 * Override with env vars if you grow the collection.
 *
 * `ANN` = Approximate Nearest Neighbors, the fast retrieval mode behind `$vectorSearch`.
 * - `numCandidates` controls how wide ANN searches before truncating.
 * - `branchLimit` controls how many rows each branch contributes to fusion.
 */
export const DEFAULT_HYBRID_NUM_CANDIDATES = 200;
export const DEFAULT_HYBRID_BRANCH_LIMIT = 64;

/**
 * Per-doc floor on `vectorSearchScore`. Env `HYBRID_MIN_VECTOR_SIMILARITY`; `0` = off.
 */
export const DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY = 0.52;

/**
 * Drop hits farther below the best score in the ANN window.
 * Here, ANN window means the vector-search candidate window retrieved for this query.
 * Env `HYBRID_VECTOR_MAX_GAP_FROM_BEST`; `0` = off.
 */
export const DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST = 0.05;

/**
 * If the single best vector score in the window is below this, return no results (weak / nonsense queries).
 * Env `HYBRID_MIN_BEST_VECTOR_SCORE`; `0` = off.
 */
export const DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE = 0.58;

export async function getCollection(): Promise<Collection<ImageDoc>> {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<ImageDoc>(COLLECTION_NAME);
}
