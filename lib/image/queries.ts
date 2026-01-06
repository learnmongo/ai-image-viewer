import { ObjectId, Collection } from 'mongodb';
import clientPromise from '../mongo';
import { ImageDoc } from '@/types/image';
import { hexToRgb, colorDistance } from './utils';

const COLLECTION_NAME = 'images';
const DATABASE_NAME = 'seevector';
const DEFAULT_LIMIT = 25;
const DEFAULT_SEARCH_INDEX = 'ix_text';
const DEFAULT_COLOR_THRESHOLD = 60;

/**
 * Get the MongoDB collection for images.
 * @returns Promise resolving to the images collection
 */
async function getCollection(): Promise<Collection<ImageDoc>> {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<ImageDoc>(COLLECTION_NAME);
}

/**
 * Get a single image by its MongoDB ObjectId.
 * @param id - The image ObjectId as a string
 * @returns Promise resolving to the image document or null if not found
 */
export async function getImageById(id: string): Promise<ImageDoc | null> {
  const col = await getCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

/**
 * Get images by tag. Uses MongoDB array matching.
 * @param tag - The tag to search for
 * @returns Promise resolving to an array of images with the specified tag
 */
export async function getImagesByTag(tag: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ tags: tag }).toArray();
}

export async function getImagesByFeeling(feeling: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ feelings: feeling }).toArray();
}

export async function getImagesByHue(hue: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ hues: hue }).toArray();
}

/**
 * Get images by exact color hex value.
 * @param color - Hex color string (e.g. #FF0000)
 * @returns Promise resolving to an array of images with the exact color
 */
export async function getImagesByExactColor(color: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ colors: color }).toArray();
}

/**
 * Get images by fuzzy color match (within a threshold in RGB space).
 * Note: This loads all images into memory for color comparison.
 * For better performance with large datasets, consider using MongoDB aggregation.
 * @param color - Hex color string (e.g. #FF0000)
 * @param threshold - RGB distance threshold (default: 60)
 * @returns Promise resolving to an array of images with similar colors
 */
export async function getImagesByColorFuzzy(
  color: string, 
  threshold: number = DEFAULT_COLOR_THRESHOLD
): Promise<ImageDoc[]> {
  const col = await getCollection();
  // Get all images with colors (this could be optimized with aggregation for large datasets)
  const all = await col.find({ 
    colors: { $exists: true, $ne: [] } 
  }).toArray();
  
  const targetRgb = hexToRgb(color);
  return all.filter(img =>
    img.colors?.some(c => colorDistance(hexToRgb(c), targetRgb) <= threshold)
  );
}

/**
 * Get the latest images, sorted by _id descending.
 * @param limit - Number of images to return (default: 25)
 * @returns Promise resolving to an array of the latest images
 */
export async function getLatestImages(limit: number = DEFAULT_LIMIT): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col
    .find({})
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
}

/**
 * Search images using Atlas Search $search aggregation stage.
 * @param query - Search query text
 * @param limit - Maximum number of results to return (default: 25)
 * @param textIndex - Name of the Atlas Search index to use (default: 'ix_text')
 * @returns Promise resolving to an array of images with search scores
 */
export async function searchImages(
  query: string, 
  limit: number = DEFAULT_LIMIT, 
  textIndex: string = DEFAULT_SEARCH_INDEX
): Promise<(ImageDoc & { score: number })[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const col = await getCollection();
  return col
    .aggregate<ImageDoc & { score: number }>([
      {
        $search: {
          index: textIndex,
          text: {
            query: query.trim(),
            path: {
              wildcard: '*' // Search all fields in the index
            }
          }
        }
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' }
        }
      },
      {
        $sort: { score: -1, _id: -1 }
      },
      {
        $limit: limit
      }
    ])
    .toArray();
}