# AI Image Viewer

A practical example of combining AI-generated image metadata with MongoDB Search, MongoDB Vector Search, and hybrid search.

This project starts with a folder of images, uses local models through Ollama to describe and structure them, stores the results as MongoDB documents, generates Voyage AI embeddings, and then exposes the data through a Next.js image viewer.

The goal is not to build the perfect image library. The goal is to demonstrate an approachable, real-world pattern for combining AI with MongoDB.

## What this project demonstrates

- Image analysis with a vision-capable model through Ollama
- A second model pass that converts free-form analysis into structured JSON
- A MongoDB document model for generated metadata, EXIF location data, prompt history, and embeddings
- MongoDB Search for keyword relevance
- MongoDB Vector Search for semantic similarity
- Hybrid search with `$rankFusion`
- A Next.js interface for browsing by tags, feelings, hues, colors, and search results

## Architecture

```text
Image files
    |
    v
Ollama vision model
    |
    v
Natural-language image analysis
    |
    v
Ollama instruction model
    |
    v
Structured metadata + EXIF location
    |
    v
MongoDB document
    |                         \
    |                          \
    v                           v
MongoDB Search          Voyage AI embeddings
                                |
                                v
                       MongoDB Vector Search
                                |
                                v
                          Hybrid search
                                |
                                v
                        Next.js image viewer
```

The two AI passes are intentional. The vision model focuses on understanding the image. The instruction model focuses on producing predictable JSON that maps naturally into a MongoDB document.

Read the deeper architecture notes in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Repository guide

### Image processing and enrichment

The processing tools live under [`tools/process/`](tools/process/).

Key files:

- [`tools/process/process.js`](tools/process/process.js) coordinates vision analysis, structured metadata generation, EXIF extraction, and persistence
- [`tools/process/services/ai/vision.js`](tools/process/services/ai/vision.js) sends an image to the Ollama vision model
- [`tools/process/services/ai/instruct.js`](tools/process/services/ai/instruct.js) turns the first model response into structured JSON
- [`tools/process/services/ai/prompts/`](tools/process/services/ai/prompts/) contains versioned prompts
- [`tools/process/services/metadata.js`](tools/process/services/metadata.js) extracts GPS coordinates from EXIF metadata
- [`tools/process/generate-embeddings.js`](tools/process/generate-embeddings.js) generates Voyage AI embeddings for existing documents

The processing flow begins here:

```js
const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(
  imageName,
  LLAMA_VISION_IMAGE_MODEL
);

const { parsed, prompt: descriptionPrompt } = await generateStructuredMetadata(imageInfo);

const location = await getGPSData(imageName);
```

Source: [`tools/process/process.js`](tools/process/process.js)

The final document also preserves the models, prompt versions, prompts, and responses used to create the metadata:

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

Source: [`tools/process/process.js`](tools/process/process.js)

For setup details and model notes, see [`docs/OLLAMA.md`](docs/OLLAMA.md) and [`docs/PROMPTS.md`](docs/PROMPTS.md).

### MongoDB document model

Each image becomes one MongoDB document. The actual TypeScript model includes the generated metadata, optional GeoJSON location, prompt traces, and optional embedding fields:

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

Source: [`types/image.ts`](types/image.ts)

The generated fields serve different purposes:

- `title`, `description`, `summary`, and `tags` feed keyword and embedding workflows
- `feelings` and `hues` make the collection browsable from less literal angles
- `colors` support exact and fuzzy color exploration
- `location` stores EXIF coordinates as GeoJSON when available
- `prompt_debug` keeps model experimentation inspectable
- `embedding` stores the semantic representation next to the document it describes

### Embeddings

Embeddings are generated separately so they can be refreshed without repeating image analysis.

The project builds one text input from several descriptive fields:

```js
const parts = [
  doc?.title,
  doc?.description,
  doc?.summary,
  ...(doc?.tags || []),
].filter(Boolean);

return parts.join(' ');
```

Source: [`tools/process/generate-embeddings.js`](tools/process/generate-embeddings.js)

The resulting vector and its model information are stored on the same document:

```js
await images.updateOne(
  { _id: doc._id },
  {
    $set: {
      embedding,
      embedding_model: model,
      embedding_date: new Date()
    }
  }
);
```

Source: [`tools/process/generate-embeddings.js`](tools/process/generate-embeddings.js)

### MongoDB Search

The application keeps search logic in [`lib/image/queries/`](lib/image/queries/) rather than embedding aggregation pipelines directly inside routes.

Keyword search uses `$search` across the shared field list:

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

Source: [`lib/image/queries/search.ts`](lib/image/queries/search.ts)

The searchable fields are defined once for text-only and hybrid search:

```ts
export const ATLAS_TEXT_SEARCH_PATHS = ['title', 'description', 'summary', 'tags'] as const;
```

Source: [`lib/image/queries/text-search-paths.ts`](lib/image/queries/text-search-paths.ts)

### Vector and hybrid search

Search queries are embedded with Voyage AI using `input_type: 'query'`, while stored documents use `document`:

```ts
body: JSON.stringify({
  input: [text],
  model,
  input_type: 'query',
}),
```

Source: [`lib/image/voyage-embed-query.ts`](lib/image/voyage-embed-query.ts)

Hybrid search combines a `$vectorSearch` pipeline and a MongoDB Search pipeline with `$rankFusion`:

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

Source: [`lib/image/queries/hybrid-search.ts`](lib/image/queries/hybrid-search.ts)

The implementation also runs a separate vector-similarity lookup and applies quality gates before returning results. That prevents weak semantic neighbors from filling the interface for vague or low-quality queries.

Read the complete search walkthrough in [`docs/SEARCH.md`](docs/SEARCH.md).

### Next.js application

The home page loads the latest documents and converts MongoDB `ObjectId` values before passing them to client components:

```ts
const images = await getLatestImages(25);
const imageList = toImageArray(images);
```

Source: [`app/page.tsx`](app/page.tsx)

The API route stays deliberately thin and chooses between text-only and hybrid search:

```ts
const results =
  hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
```

Source: [`app/api/search/route.ts`](app/api/search/route.ts)

The interface also supports:

- Debounced search after three characters
- A toggle between keyword and hybrid search
- A suggestion to enable vector plus text search when keyword search returns nothing
- Result ranks for hybrid search
- MongoDB Search score badges for stronger text-only results
- Per-image document and model-response inspection

Relevant files:

- [`components/search/useImageSearch.ts`](components/search/useImageSearch.ts)
- [`components/search/SearchInputBar.tsx`](components/search/SearchInputBar.tsx)
- [`components/search/SearchSuggestHybrid.tsx`](components/search/SearchSuggestHybrid.tsx)
- [`components/search/SearchResultCard.tsx`](components/search/SearchResultCard.tsx)
- [`components/DocumentModal.tsx`](components/DocumentModal.tsx)
- [`components/ModelResponsesModal.tsx`](components/ModelResponsesModal.tsx)

## Additional ways to explore the data

The viewer is not limited to the main search box.

MongoDB array queries power routes for tags, feelings, and hues:

```ts
return col
  .find({ feelings: feeling })
  .sort({ _id: -1 })
  .limit(limit)
  .toArray();
```

Source: [`lib/image/queries/by-array-field.ts`](lib/image/queries/by-array-field.ts)

Fuzzy color browsing uses MongoDB to narrow the candidate set, then calculates RGB distance in application code:

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

Source: [`lib/image/queries/by-color.ts`](lib/image/queries/by-color.ts)

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) ... end-to-end system design and major decisions
- [`docs/CODE-GUIDE.md`](docs/CODE-GUIDE.md) ... a guided tour of the repository
- [`docs/SEARCH.md`](docs/SEARCH.md) ... MongoDB Search, vector search, hybrid search, and quality gates
- [`docs/OLLAMA.md`](docs/OLLAMA.md) ... local model setup and how this project uses Ollama
- [`docs/PROMPTS.md`](docs/PROMPTS.md) ... the two-stage prompt design and version tracking

## Minimal setup

The repository has two Node.js applications with separate dependency files:

```bash
npm install
cd tools/process
npm install
```

Create `.env.local` at the repository root for the Next.js app and `.env` under `tools/process/` for the processing tools. Example files are included:

- [`.env.example`](.env.example)
- [`tools/process/.env.example`](tools/process/.env.example)

Start the web app:

```bash
npm run dev
```

Process one image from the repository's `assets/` directory:

```bash
cd tools/process
npx process 001.jpg
```

Generate embeddings for documents that do not yet contain one:

```bash
npx generate-embeddings --limit 50
```

See [`tools/process/README.md`](tools/process/README.md) for the processing commands.

## Technology

- MongoDB
- MongoDB Search
- MongoDB Vector Search
- MongoDB Node.js Driver
- Next.js
- React
- TypeScript
- Chakra UI
- Ollama
- Voyage AI

## Related video

This repository accompanies a MongoDB tutorial covering the architecture, code, and reasoning behind the application. The video link will be added here when it is published.

## Author

Justin Jenkins  
MongoDB Champion  
[LearnMongo](https://learnmongo.com)
