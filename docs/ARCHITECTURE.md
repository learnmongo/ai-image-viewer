# Architecture

This project is split into two main applications:

1. A Node.js processing tool that turns image files into enriched MongoDB documents
2. A Next.js application that browses and searches those documents

## End-to-end flow

```text
assets/
   |
   v
tools/process/process.js
   |
   +--> Ollama vision model
   |        |
   |        v
   |    image analysis
   |
   +--> Ollama instruction model
   |        |
   |        v
   |    structured JSON
   |
   +--> EXIF GPS extraction
   |
   v
MongoDB document
   |
   +--> tools/process/generate-embeddings.js
   |        |
   |        v
   |    Voyage AI document embedding
   |
   v
MongoDB collection
   |
   +--> MongoDB Search
   +--> MongoDB Vector Search
   +--> Hybrid $rankFusion
   |
   v
Next.js API route
   |
   v
React search and browsing interface
```

## Why two model passes?

The first pass asks a vision-capable model to understand the image:

```js
const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(
  imageName,
  LLAMA_VISION_IMAGE_MODEL
);
```

The second pass asks an instruction model to convert that response into predictable JSON:

```js
const { parsed, prompt: descriptionPrompt } = await generateStructuredMetadata(imageInfo);
```

Source: [`../tools/process/process.js`](../tools/process/process.js)

This separation keeps two different concerns apart:

- Image understanding can be improved without changing the output schema
- JSON formatting can be refined without sending the image through the vision model again

## Why store prompt history?

The processing pipeline stores the model name, prompt version, prompt, and response:

```js
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
```

Source: [`../tools/process/process.js`](../tools/process/process.js)

The UI can display these traces through [`../components/ModelResponsesModal.tsx`](../components/ModelResponsesModal.tsx). This makes prompt iteration inspectable rather than hiding the generation process after insertion.

## Why one MongoDB document per image?

The metadata, location, prompt history, and embedding all describe the same image. Keeping them together creates a natural aggregate:

```ts
export interface ImageDoc {
  _id: ObjectId;
  title: string;
  description: string;
  summary: string;
  feelings?: string[];
  hues?: string[];
  colors: string[];
  tags?: string[];
  file: string;
  location: GeoJsonPoint | null;
  raw?: RawModelResponse[];
  prompt_debug?: RawModelResponse[];
  embedding?: number[];
  embedding_model?: string;
  embedding_date?: Date;
}
```

Source: [`../types/image.ts`](../types/image.ts)

This model supports standard MongoDB queries, MongoDB Search, MongoDB Vector Search, and UI rendering without synchronizing multiple data stores.

## Why generate embeddings separately?

The image-processing script inserts useful, searchable documents before embeddings exist. [`../tools/process/generate-embeddings.js`](../tools/process/generate-embeddings.js) later finds only documents missing the `embedding` field:

```js
const query = { embedding: { $exists: false } };
```

This provides a few useful properties:

- Image analysis and embedding costs are independent
- Embeddings can be regenerated after switching models
- Existing metadata remains useful before vector search is configured

## Why separate query logic from API routes?

The API route contains little more than input selection and serialization:

```ts
const results =
  hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
```

Source: [`../app/api/search/route.ts`](../app/api/search/route.ts)

The MongoDB aggregation pipelines live under [`../lib/image/queries/`](../lib/image/queries/). This makes the search behavior easier to read, tune, and demonstrate independently of HTTP concerns.

## Search architecture

Text-only search uses `$search` and MongoDB Search scores.

Hybrid search does more:

1. Embed the user's query with Voyage AI using query input mode
2. Run a raw `$vectorSearch` pipeline to collect semantic similarity values
3. Run `$rankFusion` over vector and full-text branches
4. Reject weak result windows and weak individual semantic matches
5. Sort accepted results by raw vector similarity
6. Return the fused score as metadata for the accepted documents

See [`SEARCH.md`](SEARCH.md) for the real pipelines and configuration controls.

## Application architecture

```text
app/page.tsx
   |
   v
getLatestImages()
   |
   v
ImageGridWithSearch
   |
   v
SearchBox / useImageSearch
   |
   v
POST /api/search
   |
   +--> searchImages()
   +--> searchImagesHybrid()
   |
   v
MongoDB
```

The viewer also exposes direct routes for tags, feelings, hues, colors, and individual images.
