# Code Guide

This guide points to the code behind the major parts of the project.

## 1. Process an image

Start with [`../tools/process/process.js`](../tools/process/process.js).

It validates the file, connects to MongoDB, builds the document, inserts it, and closes the connection:

```js
await connect();
try {
  const doc = await buildImageDoc(imageName);
  await insertImage(doc);
  console.log(`Stored: ${imageName}`);
} finally {
  await close();
}
```

The actual insert is kept in [`../tools/process/services/database.js`](../tools/process/services/database.js):

```js
const db = client.db(DB_NAME);
const images = db.collection(COLLECTION);
const result = await images.insertOne(imageDoc);
```

## 2. Analyze the image with Ollama

[`../tools/process/services/ai/vision.js`](../tools/process/services/ai/vision.js) sends the local image path to Ollama:

```js
await ollama.chat({
  model: model,
  messages: [{
    role: 'user',
    content: processingPrompt,
    images: [imagePath]
  }]
})
```

The prompt comes from [`../tools/process/services/ai/prompts/vision.js`](../tools/process/services/ai/prompts/vision.js).

## 3. Convert model output into structured JSON

[`../tools/process/services/ai/instruct.js`](../tools/process/services/ai/instruct.js) sends the vision response through an instruction model:

```js
const jsonOutput = await ollama.chat({
  model: INSTRUCT_MODEL,
  messages: [{
    role: 'user',
    content: descriptionPrompt,
  }]
});

const raw = jsonOutput.message.content.trim();
const parsed = parseJsonResponse(raw);
```

The schema is defined inside [`../tools/process/services/ai/prompts/instruct.js`](../tools/process/services/ai/prompts/instruct.js).

## 4. Add EXIF location data

[`../tools/process/services/metadata.js`](../tools/process/services/metadata.js) reads GPS values and creates a GeoJSON point:

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

The value is `null` when no GPS metadata exists.

## 5. Generate document embeddings

[`../tools/process/generate-embeddings.js`](../tools/process/generate-embeddings.js) queries documents without embeddings:

```js
const query = { embedding: { $exists: false } };
const cursor = images.find(query, {
  projection: { _id: 1, title: 1, description: 1, summary: 1, tags: 1 },
  ...(limit && { limit }),
});
```

It combines the descriptive fields before calling Voyage AI:

```js
const parts = [
  doc?.title,
  doc?.description,
  doc?.summary,
  ...(doc?.tags || []),
].filter(Boolean);

return parts.join(' ');
```

The Voyage client wrapper is in [`../tools/process/services/ai/embeddings.js`](../tools/process/services/ai/embeddings.js).

## 6. Connect the Next.js app to MongoDB

[`../lib/mongo.ts`](../lib/mongo.ts) maintains one shared connection promise:

```ts
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
return global._mongoClientPromise;
```

[`../lib/image/queries/base.ts`](../lib/image/queries/base.ts) resolves the configured database and collection:

```ts
export async function getCollection(): Promise<Collection<ImageDoc>> {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<ImageDoc>(COLLECTION_NAME);
}
```

## 7. Load recent images

[`../lib/image/queries/latest.ts`](../lib/image/queries/latest.ts) uses the timestamp embedded in MongoDB `ObjectId` values:

```ts
return col
  .find({})
  .sort({ _id: -1 })
  .limit(limit)
  .toArray();
```

[`../app/page.tsx`](../app/page.tsx) loads the documents on the server and converts them for client components.

## 8. Browse generated metadata

[`../lib/image/queries/by-array-field.ts`](../lib/image/queries/by-array-field.ts) contains direct array-value queries for tags, feelings, hues, and exact colors:

```ts
return col
  .find({ tags: tag })
  .sort({ _id: -1 })
  .limit(limit)
  .toArray();
```

The related routes are:

- [`../app/tag/[tag]/page.tsx`](../app/tag/[tag]/page.tsx)
- [`../app/feeling/[feeling]/page.tsx`](../app/feeling/[feeling]/page.tsx)
- [`../app/hue/[hue]/page.tsx`](../app/hue/[hue]/page.tsx)
- [`../app/color/[color]/page.tsx`](../app/color/[color]/page.tsx)

## 9. Perform fuzzy color matching

[`../lib/image/queries/by-color.ts`](../lib/image/queries/by-color.ts) first uses MongoDB to reduce the candidate set:

```ts
const pipeline = [
  {
    $match: {
      colors: { $exists: true, $ne: [] }
    }
  },
  { $sort: { _id: -1 } },
  { $limit: limit * 5 }
];
```

It then calculates RGB distance in TypeScript and returns the nearest colors. This is an example of using MongoDB for efficient candidate filtering while keeping a specialized calculation in application code.

## 10. Run keyword search

[`../lib/image/queries/search.ts`](../lib/image/queries/search.ts) builds the `$search` pipeline.

The API endpoint in [`../app/api/search/route.ts`](../app/api/search/route.ts) converts the resulting MongoDB documents into client-safe values:

```ts
const images = toImageArray(results).map((img, i) => ({
  ...img,
  score: results[i]?.score,
}));
```

## 11. Run hybrid search

[`../lib/image/queries/hybrid-search.ts`](../lib/image/queries/hybrid-search.ts) is the main technical search implementation.

It performs both raw vector similarity lookup and rank fusion in parallel:

```ts
const [similarityRows, fusedRows] = await Promise.all([
  col
    .aggregate<{ _id: ImageDoc['_id']; _vectorSearchSim?: unknown }>(vectorSimilarityLookupPipeline)
    .toArray(),
  col.aggregate<ImageDoc & { score?: unknown }>(hybridFusionPipeline).toArray(),
]);
```

The similarity map is then used for quality filtering and final order.

Read [`SEARCH.md`](SEARCH.md) for the full explanation.

## 12. Understand the search UI

[`../components/search/useImageSearch.ts`](../components/search/useImageSearch.ts) controls query state, debounce behavior, search mode, and API calls:

```ts
const MIN_QUERY_LEN = 3;
const DEBOUNCE_MS = 700;
```

The request includes the current mode:

```ts
body: JSON.stringify({ query: searchQuery, hybrid }),
```

When text search returns no results, [`../components/search/SearchSuggestHybrid.tsx`](../components/search/SearchSuggestHybrid.tsx) offers to enable vector plus text search.

## 13. Inspect documents and prompts

The individual image route is [`../app/view/[slug]/page.tsx`](../app/view/[slug]/page.tsx).

It passes both a client-safe MongoDB document and the model traces into UI actions:

```tsx
<ViewerActions
  document={toImage(imageDoc)}
  responses={getModelResponseEntries(imageDoc)}
/>
```

The related modals are:

- [`../components/DocumentModal.tsx`](../components/DocumentModal.tsx)
- [`../components/ModelResponsesModal.tsx`](../components/ModelResponsesModal.tsx)
