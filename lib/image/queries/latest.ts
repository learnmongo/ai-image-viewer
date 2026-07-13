import { getCollection, DEFAULT_LIMIT } from './base';
import { ImageDoc } from '@/types/image';

/**
 * Get the latest images, sorted by _id descending (newest first).
 * 
 * Example: Simple find query with sorting.
 * MongoDB ObjectIds include a timestamp, so sorting by _id descending
 * gives us newest documents first.
 * 
 * @param limit - Number of images to return (default: 25)
 * @returns Promise resolving to an array of the latest images
 * 
 * @example
 * ```ts
 * // Get latest 25 images
 * const images = await getLatestImages();
 * 
 * // Get latest 10 images
 * const images = await getLatestImages(10);
 * ```
 */
export async function getLatestImages(
  limit: number = DEFAULT_LIMIT
): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  // Find all documents, sort by _id descending (newest first), limit results
  return col
    .find({})
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
}
