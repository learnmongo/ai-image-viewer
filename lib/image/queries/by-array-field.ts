import { getCollection, DEFAULT_LIMIT } from './base';
import { ImageDoc } from '@/types/image';

/**
 * Get images by tag.
 * 
 * Example: Array field query using MongoDB's array matching.
 * MongoDB automatically matches documents where the array contains the value.
 * 
 * Recommended index: db.images.createIndex({ tags: 1 })
 * 
 * @param tag - The tag to search for
 * @param limit - Maximum number of results (default: 25)
 * @returns Promise resolving to an array of images with the specified tag
 * 
 * @example
 * ```ts
 * const images = await getImagesByTag('nature');
 * ```
 */
export async function getImagesByTag(
  tag: string,
  limit: number = DEFAULT_LIMIT
): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  // MongoDB automatically matches documents where 'tags' array contains 'tag'
  return col
    .find({ tags: tag })
    .sort({ _id: -1 }) // Latest first
    .limit(limit)
    .toArray();
}

/**
 * Get images by feeling.
 * 
 * Example: Same pattern as tags - array field matching.
 * 
 * Recommended index: db.images.createIndex({ feelings: 1 })
 * 
 * @param feeling - The feeling to search for
 * @param limit - Maximum number of results (default: 25)
 * @returns Promise resolving to an array of images with the specified feeling
 * 
 * @example
 * ```ts
 * const images = await getImagesByFeeling('calm');
 * ```
 */
export async function getImagesByFeeling(
  feeling: string,
  limit: number = DEFAULT_LIMIT
): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  return col
    .find({ feelings: feeling })
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
}

/**
 * Get images by hue.
 * 
 * Example: Array field matching pattern.
 * 
 * Recommended index: db.images.createIndex({ hues: 1 })
 * 
 * @param hue - The hue to search for
 * @param limit - Maximum number of results (default: 25)
 * @returns Promise resolving to an array of images with the specified hue
 * 
 * @example
 * ```ts
 * const images = await getImagesByHue('blue');
 * ```
 */
export async function getImagesByHue(
  hue: string,
  limit: number = DEFAULT_LIMIT
): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  return col
    .find({ hues: hue })
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
}

/**
 * Get images by exact color hex value.
 * 
 * Example: Array field matching with value normalization.
 * 
 * Recommended index: db.images.createIndex({ colors: 1 })
 * 
 * @param color - Hex color string (e.g. #FF0000 or FF0000)
 * @param limit - Maximum number of results (default: 25)
 * @returns Promise resolving to an array of images with the exact color
 * 
 * @example
 * ```ts
 * const images = await getImagesByExactColor('#FF0000');
 * ```
 */
export async function getImagesByExactColor(
  color: string,
  limit: number = DEFAULT_LIMIT
): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  // Normalize color format (ensure # prefix)
  const normalizedColor = color.startsWith('#') ? color : `#${color}`;
  
  return col
    .find({ colors: normalizedColor })
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
}
