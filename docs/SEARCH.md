# Search

This project demonstrates three related retrieval approaches:

1. MongoDB Search for keyword relevance
2. MongoDB Vector Search for semantic similarity
3. Hybrid search that combines both result sets

## Shared searchable fields

Text-only and hybrid search use the same paths:

```ts
export const ATLAS_TEXT_SEARCH_PATHS = ['title', 'description', 'summary', 'tags'] as const;
```

Source: [`../lib/image/queries/text-search-paths.ts`](../lib/image/queries/text-search-paths.ts)

## MongoDB Search

[`../lib/image/queries/search.ts`](../lib/image/queries/search.ts) runs `$search`, copies the search score into a regular field, sorts, and limits:

```ts
const pipeline = [
  {
    $search: {
      index: textIndex,
      text: {
        query: q,
        path: [...ATLAS_TEXT_SEARCH_PATHS],
      },
    },
  },
  { $addFields: { score: { $meta: 'searchScore' } } },
  { $sort: { score: -1, _id: -1 } },
  { $limit: limit },
];
```

The default index name is `ix_text` in [`../lib/image/queries/base.ts`](../lib/image/queries/base.ts).

A standalone command-line version is available in [`../tools/process/text-search.js`](../tools/process/text-search.js):

```bash
cd tools/process
npx text-search "beach sunset"
```

## Document embeddings

[`../tools/process/generate-embeddings.js`](../tools/process/generate-embeddings.js) embeds existing documents with Voyage AI.

The project uses `document` input mode for stored content:

```js
const embedding = await embedText(text, { model, inputType });
```

The defaults come from [`../tools/process/config.js`](../tools/process/config.js):

```js
export const VOYAGE_EMBED_MODEL = process.env.VOYAGE_EMBED_MODEL || 'voyage-4';
export const VOYAGE_EMBED_INPUT_TYPE = process.env.VOYAGE_EMBED_INPUT_TYPE || 'document';
```

## Query embeddings

The Next.js application embeds user queries separately with `input_type: 'query'`:

```ts
body: JSON.stringify({
  input: [text],
  model,
  input_type: 'query',
}),
```

Source: [`../lib/image/voyage-embed-query.ts`](../lib/image/voyage-embed-query.ts)

Using the same model for stored documents and user queries is essential. The different input modes tell the embedding model which side of the retrieval task it is encoding.

## Standalone vector search

[`../tools/process/vector-search.js`](../tools/process/vector-search.js) contains a small `$vectorSearch` example:

```js
{
  $vectorSearch: {
    index: 'vector_index',
    path: 'embedding',
    queryVector,
    numCandidates: 100,
    limit: 80,
  },
},
{
  $addFields: {
    vectorSearchScore: { $meta: 'vectorSearchScore' },
  },
},
{
  $match: {
    vectorSearchScore: { $gte: 0.6 },
  },
},
```

Run it with:

```bash
cd tools/process
npx vector-search "rainy afternoon"
```

## Hybrid search

[`../lib/image/queries/hybrid-search.ts`](../lib/image/queries/hybrid-search.ts) combines vector and full-text candidates with `$rankFusion`.

### Step 1 ... embed the query

```ts
const queryVector = await embedSearchQuery(q, EMBED_MODEL);
```

### Step 2 ... retrieve raw vector similarity

A separate pipeline records the real vector-search score for each candidate:

```ts
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
```

### Step 3 ... fuse vector and text ranks

```ts
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
```

`$rankFusion` combines the relative ranks from the two branches. Its score is not the same thing as raw vector similarity.

### Step 4 ... apply semantic quality gates

The application avoids returning a full grid of weak semantic neighbors.

It can reject:

- The entire query when the best vector score is too weak
- Individual documents below a minimum vector similarity
- Documents that are too far behind the best semantic result

The defaults are defined in [`../lib/image/queries/base.ts`](../lib/image/queries/base.ts):

```ts
export const DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY = 0.52;
export const DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST = 0.05;
export const DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE = 0.58;
```

### Step 5 ... final ordering

After the fusion candidates pass quality gates, the current implementation sorts accepted results by raw vector similarity:

```ts
filteredFused.sort(
  (a, b) =>
    (vectorSimilarityById.get(String(b._id)) ?? 0) - (vectorSimilarityById.get(String(a._id)) ?? 0),
);
```

This means the fusion weights influence which candidates are included, while semantic similarity controls the final displayed order among accepted documents.

## Search API

[`../app/api/search/route.ts`](../app/api/search/route.ts) chooses the search strategy from the request body:

```ts
const results =
  hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
```

## Search interface

[`../components/search/useImageSearch.ts`](../components/search/useImageSearch.ts) starts searching after three characters and waits 700 milliseconds between keystrokes:

```ts
const MIN_QUERY_LEN = 3;
const DEBOUNCE_MS = 700;
```

Text search and hybrid search are deliberately visible modes. The UI does not label the `$rankFusion` score as a confidence percentage. Hybrid results display rank instead:

```ts
const badgeLabel = hybrid
  ? total <= 1
    ? 'Best match'
    : `Rank ${rankIndex + 1} of ${total}`
  : typeof img.score === 'number'
    ? `Score ${img.score.toFixed(3)}`
    : null;
```

Source: [`../components/search/SearchResultCard.tsx`](../components/search/SearchResultCard.tsx)

## Configuration

The Next.js application supports these optional hybrid controls:

```env
MONGODB_VECTOR_INDEX=vector_index
HYBRID_NUM_CANDIDATES=200
HYBRID_BRANCH_LIMIT=64
HYBRID_MIN_VECTOR_SIMILARITY=0.52
HYBRID_VECTOR_MAX_GAP_FROM_BEST=0.05
HYBRID_MIN_BEST_VECTOR_SCORE=0.58
```

Use the defaults as a starting point. Search quality thresholds depend on the embedding model, data, and catalog size.

## Resources

- [MongoDB hybrid search overview](https://www.mongodb.com/docs/vector-search/hybrid-search/hybrid-search-overview/)
- [MongoDB `$rankFusion`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/rankfusion/)
- [Voyage AI text embeddings](https://docs.voyageai.com/docs/embeddings)
