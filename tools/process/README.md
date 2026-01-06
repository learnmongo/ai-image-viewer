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

3. Install dependencies (if not already installed):
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

## How it works

1. Validates the image file exists
2. Extracts GPS data from EXIF metadata
3. Generates image description using vision AI model
4. Creates structured metadata using instruction AI model
5. Stores everything in MongoDB

