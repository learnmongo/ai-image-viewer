# Code Guide

This guide is a technical tour of the AI Image Viewer repository. It focuses on where important behavior lives and why the project is structured this way.

## 1. Image ingestion

Start with [`tools/process/process.js`](tools/process/process.js).

The file coordinates the complete image-to-document pipeline:

```js
const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(
  imageName,
  LLAMA_VISION_IMAGE_MODEL
);

const { parsed, prompt: descriptionPrompt } = await generateStructuredMetadata(imageInfo);

const location = await getGPSData(imageName);
```

The resulting document combines the parsed AI metadata, the image filename, optional GeoJSON location, and model traces:

```js
return {
  ...parsed,
  file: imageName,
  location,
  prompt_debug: [
    {
      model: LLAMA_VISION_IMAGE_MODEL,
      version: VISION_VERSION,
      prompt: imageInfoPrompt,
      response: imageInfo,
    },
    {
      model: INSTRUCT_MODEL,
      version: INSTRUCT_VERSION,
      prompt: descriptionPrompt,
      response: parsed,
    },
  ],
};
```

### Related files

- [`tools/process/services/ai/vision.js`](tools/process/services/ai/vision.js)
- [`tools/process/services/ai/instruct.js`](tools/process/services/ai/instruct.js)
- [`tools/process/services/ai/prompts/vision.js`](tools/process/services/ai/prompts/vision.js)
- [`tools/process/services/ai/prompts/instruct.js`](tools/process/services/ai/prompts/instruct.js)
- [`tools/process/services/metadata.js`](tools/process/services/metadata.js)
- [`tools/process/services/database.js`](tools/process/services/database.js)

## 2. Prompt design

The vision prompt asks for human-readable observations in a fixed text format. The instruction prompt then transforms that result into JSON.

The instruction schema in [`tools/process/services/ai/prompts/instruct.js`](tools/process/services/ai/prompts/instruct.js) is:

```js
{
  "title": "...",
  "description": "...",
  "summary": "...",
  "feelings": ["...", "..."],
  "hues": ["...", "..."],
  "colors": ["#XXXXXX", "#XXXXXX"],
  "tags": ["...", "..."]
}
```

Separating image understanding from JSON formatting gives each model a narrower job.

## 3. EXIF location data

[`tools/process/services/metadata.js`](tools/process/services/metadata.js) stores GPS information in GeoJSON order:

```js
return {
  type: "Point",
  coordinates: [
    tags.GPSLongitude,
    tags.GPSLatitude,
    tags.GPSAltitude || 0
  ]
};
```

This means the same image document can support search, metadata browsing, and future geospatial features.

## 4. MongoDB persistence

[`tools/process/services/database.js`](tools/process/services/database.js) inserts the assembled document directly:

```js
const db = client.db(DB_NAME);
const images = db.collection(COLLECTION);
const result = await images.insertOne(imageDoc);
```

The application uses a separate shared client in [`lib/mongo.ts`](lib/mongo.ts), while collection configuration is centralized in [`lib/image/queries/base.ts`](lib/image/queries/base.ts).

## 5. Embedding generation

[`tools/process/generate-embeddings.js`](tools/process/generate-embeddings.js) only processes documents without an embedding:

```js
const query = { embedding: { $exists: false } };
```

It combines several fields:

```js
const parts = [
  doc?.title,
  doc?.description,
  doc?.summary,
  ...(doc?.tags || []),
].filter(Boolean);

return parts.join(' ');
```

That combined text is embedded as a document and stored back on the same MongoDB document.

Incoming search text is embedded as a query in [`lib/image/voyage-embed-query.ts`](lib/image/voyage-embed-query.ts):

```ts
body: JSON.stringify({
  input: [text],
  model,
  input_type: 'query',
}),
```

## 6. Query organization

The MongoDB query layer lives in [`lib/image/queries/`](lib/image/queries/).

- [`latest.ts`](lib/image/queries/latest.ts) loads the homepage collection
- [`by-id.ts`](lib/image/queries/by-id.ts) loads an individual image
- [`by-array-field.ts`](lib/image/queries/by-array-field.ts) handles tags, feelings, hues, and exact colors
- [`by-color.ts`](lib/image/queries/by-color.ts) supports fuzzy color matching
- [`search.ts`](lib/image/queries/search.ts) handles keyword search
- [`hybrid-search.ts`](lib/image/queries/hybrid-search.ts) handles vector plus keyword search
- [`text-search-paths.ts`](lib/image/queries/text-search-paths.ts) centralizes searchable fields
- [`base.ts`](lib/image/queries/base.ts) centralizes collection and search configuration

## 7. Keyword search

[`lib/image/queries/search.ts`](lib/image/queries/search.ts) uses `$search`, captures `searchScore`, then sorts and limits the results:

```ts
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
```

A standalone command-line demo is available in [`tools/process/text-search.js`](tools/process/text-search.js).

## 8. Vector search

[`tools/process/vector-search.js`](tools/process/vector-search.js) is the clearest focused example:

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

This script is intentionally direct, making it useful for demonstrations and experimentation.

## 9. Hybrid search

[`lib/image/queries/hybrid-search.ts`](lib/image/queries/hybrid-search.ts) is the most advanced query in the repository.

It does two things in parallel:

1. Runs a vector search to capture the raw vector similarity for each candidate
2. Runs `$rankFusion` across vector and keyword pipelines

The fusion weights are currently equal:

```ts
combination: {
  weights: { vectorPipeline: 0.5, fullTextPipeline: 0.5 },
},
```

After fusion, the code applies semantic quality gates using the raw vector scores. The defaults are defined in [`lib/image/queries/base.ts`](lib/image/queries/base.ts):

```ts
export const DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY = 0.52;
export const DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST = 0.05;
export const DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE = 0.58;
```

These are overrideable through environment variables.

## 10. Search API

[`app/api/search/route.ts`](app/api/search/route.ts) keeps the API route small:

```ts
const results =
  hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
```

The route converts MongoDB documents into client-safe objects and preserves the score from the selected pipeline.

## 11. Search UI

The client logic lives in [`components/search/useImageSearch.ts`](components/search/useImageSearch.ts).

It debounces queries, sends the selected search mode to the API, and offers hybrid search when keyword search returns no results.

```ts
body: JSON.stringify({ query: searchQuery, hybrid }),
```

The toggle UI lives in [`components/search/SearchInputBar.tsx`](components/search/SearchInputBar.tsx), while result scores and ranks are displayed by [`components/search/SearchResultCard.tsx`](components/search/SearchResultCard.tsx).

## 12. Client-safe MongoDB documents

Next.js client components cannot receive MongoDB `ObjectId` values directly. [`lib/image/utils.ts`](lib/image/utils.ts) handles the conversion:

```ts
export function toImage(doc: ImageDoc): ImageItem {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}
```

## Suggested reading path

A useful order for exploring the project is:

1. [`tools/process/process.js`](tools/process/process.js)
2. [`tools/process/services/ai/prompts/`](tools/process/services/ai/prompts/)
3. [`tools/process/generate-embeddings.js`](tools/process/generate-embeddings.js)
4. [`tools/process/text-search.js`](tools/process/text-search.js)
5. [`tools/process/vector-search.js`](tools/process/vector-search.js)
6. [`lib/image/queries/search.ts`](lib/image/queries/search.ts)
7. [`lib/image/queries/hybrid-search.ts`](lib/image/queries/hybrid-search.ts)
8. [`app/api/search/route.ts`](app/api/search/route.ts)
9. [`components/search/`](components/search/)
