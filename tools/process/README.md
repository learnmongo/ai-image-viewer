# Image Processor Tool

Process images with AI vision models and store metadata in MongoDB.

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
   ```

3. (Optional) Embeddings with Voyage AI:
   ```
   VOYAGE_API_KEY=your_voyage_api_key
   VOYAGE_EMBED_MODEL=voyage-4
   VOYAGE_EMBED_INPUT_TYPE=document
   ```

4. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

## Usage

You can run the tool in several ways:

### Option 1: Using npx (recommended - works like npm process)
```bash
npx process <image-name>
```

### Option 2: Using npm script
```bash
npm run process <image-name>
```

### Option 3: Direct execution (executable)
```bash
./process.js <image-name>
```

### Option 4: Using node
```bash
node process.js <image-name>
```

### Embeddings: Generate and store Voyage embeddings
```bash
# Generate embeddings for documents missing the 'embedding' field
# Add --limit N to cap processing
# This will NOT overwrite embeddings that already exist.
npx generate-embeddings --limit 50
```

### Vector search: pure `$vectorSearch` (demo / video)
Runs Atlas Vector Search on `embedding` with a score floor. Index name, limits, and Voyage model are **plain literals in `vector-search.js`** (pipeline + `embedText`) for easy demos. Only CLI argument is the search text.

```bash
npx vector-search "sunset over mountains"
```

### Text search: Atlas `$search` (demo / video)
Keyword relevance on **title**, **description**, **summary**, **tags** — same pipeline shape as `searchImages` in the app (`lib/image/queries/search.ts`). No embeddings. Index name and paths are literals in **`text-search.js`**. Requires a MongoDB Search index (default name **`ix_text`**) on this collection.

```bash
npx text-search "beach sunset"
```

## Examples

```bash
# Process an image (recommended)
npx process 001.jpg

# Process from assets directory
npx process Trip2025/jpg/000.jpg

# Alternative using npm script
npm run process 001.jpg
```

## Configuration

All configuration is done via environment variables in `.env`:

- `MONGO_URI` (required) - MongoDB connection string
- `DB_NAME` (optional, default: `dev`) - Database name
- `COLLECTION` (optional, default: `images`) - Collection name
- `LLAMA_VISION_IMAGE_MODEL` (optional) - Vision model name
- `INSTRUCT_MODEL` (optional) - Instruction model name
- `VOYAGE_API_KEY` (optional) - API key for Voyage AI embeddings
- `VOYAGE_EMBED_MODEL` (optional, default: `voyage-4`) - Voyage embedding model
- `VOYAGE_EMBED_INPUT_TYPE` (optional, default: `document`) - Voyage input type (`document` or `query`)

Notes:
- For the general “create embeddings from existing data” workflow, see MongoDB Vector Search — [Create embeddings](https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/?embedding-model=voyage&data-source=existing&language-no-interface=nodejs)

## How it works

1. Validates the image file exists
2. Extracts GPS data from EXIF metadata
3. Generates image description using vision AI model
4. Creates structured metadata using instruction AI model
5. Stores everything in MongoDB

