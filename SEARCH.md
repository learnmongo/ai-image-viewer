# Search Guide

This guide focuses on the three retrieval approaches used by the AI Image Viewer:

1. MongoDB Search for keyword relevance
2. MongoDB Vector Search for semantic similarity
3. Hybrid search for combined lexical and semantic ranking

## Shared data

Every search mode works against the same MongoDB documents.

The keyword fields are centralized in [`lib/image/queries/text-search-paths.ts`](lib/image/queries/text-search-paths.ts):

```ts
export const ATLAS_TEXT_SEARCH_PATHS = [
  'title',
  'description',
  'summary',
  'tags'
] as const;
```

The vector field is `embedding`.

## MongoDB Search

The application implementation is [`lib/image/queries/search.ts`](lib/image/queries/search.ts).

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

This is lexical search. It is strongest when the words in the query also appear in the generated title, description, summary, or tags.

The command-line demo in [`tools/process/text-search.js`](tools/process/text-search.js) projects titles, summaries, files, and scores so the result order is easy to inspect.

## Generating document embeddings

[`tools/process/generate-embeddings.js`](tools/process/generate-embeddings.js) combines title, description, summary, and tags before embedding:

```js
const parts = [
  doc?.title,
  doc?.description,
  doc?.summary,
  ...(doc?.tags || []),
].filter(Boolean);

return parts.join(' ');
```

Voyage receives these as `document` inputs. The resulting vector is stored in `embedding`.

## Embedding the search query

[`lib/image/voyage-embed-query.ts`](lib/image/voyage-embed-query.ts) uses the same model but a different input type:

```ts
body: JSON.stringify({
  input: [text],
  model,
  input_type: 'query',
}),
```

The same embedding model must be used for documents and search queries so both vectors share the same vector space.

## MongoDB Vector Search

The standalone example in [`tools/process/vector-search.js`](tools/process/vector-search.js) is the clearest place to begin:

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
{ $limit: 5 },
```

Important values:

- `index` must match the MongoDB Vector Search index name
- `path` must point to the stored vector field
- `numCandidates` controls the breadth of approximate nearest-neighbor retrieval
- `limit` caps the initial vector results
- `vectorSearchScore` exposes similarity for filtering and display

## Hybrid search

The application hybrid implementation is [`lib/image/queries/hybrid-search.ts`](lib/image/queries/hybrid-search.ts).

It embeds the query, then runs two related aggregation pipelines in parallel.

### Pipeline A: raw vector similarity

This pipeline captures `vectorSearchScore` per document:

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

### Pipeline B: rank fusion

This pipeline merges vector and keyword result order with `$rankFusion`:

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
}
```

The fusion score is a Reciprocal Rank Fusion score. It is not the same as the raw vector similarity.

## Why the second pipeline matters

A vague query can still return the nearest documents even when none are particularly good. The implementation uses the separate raw vector scores to avoid presenting weak results as strong matches.

The current defaults in [`lib/image/queries/base.ts`](lib/image/queries/base.ts) are:

```ts
export const DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY = 0.52;
export const DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST = 0.05;
export const DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE = 0.58;
```

The logic applies three checks:

1. The best vector candidate must be strong enough
2. Every returned result must clear a minimum vector similarity
3. Results cannot fall too far behind the best vector match

After those checks, the results are sorted by raw vector similarity and limited to the requested count.

## Configuration

Search defaults live in [`lib/image/queries/base.ts`](lib/image/queries/base.ts).

```ts
export const DEFAULT_SEARCH_INDEX = 'ix_text';
export const DEFAULT_VECTOR_INDEX =
  process.env.MONGODB_VECTOR_INDEX ?? 'vector_index';
```

Hybrid tuning can be overridden with:

```env
HYBRID_NUM_CANDIDATES=200
HYBRID_BRANCH_LIMIT=64
HYBRID_MIN_VECTOR_SIMILARITY=0.52
HYBRID_VECTOR_MAX_GAP_FROM_BEST=0.05
HYBRID_MIN_BEST_VECTOR_SCORE=0.58
```

These values are tuned for a relatively small image catalog and may need adjustment as the collection grows.

## API selection

[`app/api/search/route.ts`](app/api/search/route.ts) switches modes with a simple boolean:

```ts
const results =
  hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
```

The browser sends that flag from [`components/search/useImageSearch.ts`](components/search/useImageSearch.ts):

```ts
body: JSON.stringify({ query: searchQuery, hybrid }),
```

## UI behavior

- Text-only results may display the MongoDB Search score
- Hybrid results display their rank rather than presenting the rank-fusion score as a similarity percentage
- When keyword search returns nothing, the interface suggests enabling vector plus text search

Relevant files:

- [`components/search/SearchInputBar.tsx`](components/search/SearchInputBar.tsx)
- [`components/search/SearchSuggestHybrid.tsx`](components/search/SearchSuggestHybrid.tsx)
- [`components/search/SearchResultCard.tsx`](components/search/SearchResultCard.tsx)
- [`components/search/searchScoreThresholds.ts`](components/search/searchScoreThresholds.ts)

## Command-line examples

From `tools/process/`:

```bash
npx text-search "beach sunset"
npx vector-search "quiet beach evening"
```

These scripts are useful for testing the indexes and query behavior without the web application.
