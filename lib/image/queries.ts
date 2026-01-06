import { ObjectId } from 'mongodb';
import clientPromise from '../mongo';
import { ImageDoc } from '@/types/image';
import { hexToRgb, colorDistance } from './utils';

const COLLECTION = 'images';
const DB = 'seevector';

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB).collection(COLLECTION);
}

/**
 * Generic query for images by a single field value.
 * @param {string} field - The field name to query.
 * @param {string} value - The value to match.
 * @returns {Promise<ImageDoc[]>}
 */
async function getImagesByField(field: string, value: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ [field]: value }).toArray() as Promise<ImageDoc[]>;
}

/**
 * Get a single image by its MongoDB ObjectId.
 * @param {string} id - The image ObjectId as a string.
 * @returns {Promise<ImageDoc | null>}
 */
export async function getImageById(id: string): Promise<ImageDoc | null> {
  const col = await getCollection();
  return col.findOne({ _id: new ObjectId(id) }) as Promise<ImageDoc | null>;
}

/**
 * Get images by tag.
 * @param {string} tag
 * @returns {Promise<ImageDoc[]>}
 */
export function getImagesByTag(tag: string) {
  return getImagesByField('tags', tag);
}

/**
 * Get images by feeling.
 * @param {string} feeling
 * @returns {Promise<ImageDoc[]>}
 */
export function getImagesByFeeling(feeling: string) {
  return getImagesByField('feelings', feeling);
}

/**
 * Get images by hue.
 * @param {string} hue
 * @returns {Promise<ImageDoc[]>}
 */
export function getImagesByHue(hue: string) {
  return getImagesByField('hues', hue);
}

/**
 * Get images by exact color hex value.
 * @param {string} color - Hex color string (e.g. #FF0000)
 * @returns {Promise<ImageDoc[]>}
 */
export async function getImagesByExactColor(color: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ colors: color }).toArray() as Promise<ImageDoc[]>;
}

/**
 * Get images by fuzzy color match (within a threshold in RGB space).
 * @param {string} color - Hex color string (e.g. #FF0000)
 * @param {number} [threshold=60] - RGB distance threshold
 * @returns {Promise<ImageDoc[]>}
 */
export async function getImagesByColorFuzzy(color: string, threshold = 60): Promise<ImageDoc[]> {
  const col = await getCollection();
  const all = (await col.find({ colors: { $exists: true, $ne: [] } }).toArray()) as ImageDoc[];
  const targetRgb = hexToRgb(color);
  return all.filter(img =>
    img.colors?.some(c => colorDistance(hexToRgb(c), targetRgb) <= threshold)
  );
}

/**
 * Get the latest images, sorted by _id descending.
 * @param {number} limit - Number of images to return
 * @returns {Promise<ImageDoc[]>}
 */
export async function getLatestImages(limit: number = 25): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({}).sort({ _id: -1 }).limit(limit).toArray() as Promise<ImageDoc[]>;
}

/**
 * Search images using $search.
 * @param {string} query - Search query text
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<ImageDoc[]>}
 */
export async function searchImages(query: string, limit: number = 25, textIndex: string = 'ix_text'): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  if (!query || query.trim().length === 0) {
    return [];
  }

  const results = await col
    .aggregate([
      {
        $search: {
          index: textIndex,
          text: {
            query: query,
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
    .toArray() as (ImageDoc & { score: number })[];

  return results;
}