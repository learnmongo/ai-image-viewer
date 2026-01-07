import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Validate required environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required. Please create a .env file with MONGO_URI.');
}

// Database configuration
export const DB_NAME = process.env.DB_NAME || 'dev';
export const COLLECTION = process.env.COLLECTION || 'images';

// AI Model configuration
export const LLAMA_VISION_IMAGE_MODEL = process.env.LLAMA_VISION_IMAGE_MODEL || 'llama3.2-vision:11b';
export const INSTRUCT_MODEL = process.env.INSTRUCT_MODEL || 'mistral:7b-instruct';

// Embedding configuration
export const VOYAGE_EMBED_MODEL = process.env.VOYAGE_EMBED_MODEL || 'voyage-3.5';
export const VOYAGE_EMBED_INPUT_TYPE = process.env.VOYAGE_EMBED_INPUT_TYPE || 'document';

// Assets directory (resolved to absolute path)
export const ASSETS_DIR = join(__dirname, '../../assets');

// Export MongoDB URI (not exported by default for security)
export const getMongoUri = () => MONGO_URI;

