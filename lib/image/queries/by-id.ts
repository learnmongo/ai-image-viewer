import { ObjectId } from 'mongodb';
import { getCollection } from './base';
import { ImageDoc } from '@/types/image';

/**
 * Get a single image by its MongoDB ObjectId.
 * 
 * Example: Basic findOne query - simple and straightforward.
 * 
 * @param id - The image ObjectId as a string
 * @returns Promise resolving to the image document or null if not found
 * 
 * @example
 * ```ts
 * const image = await getImageById('507f1f77bcf86cd799439011');
 * if (image) {
 *   console.log(image.title);
 * }
 * ```
 */
export async function getImageById(id: string): Promise<ImageDoc | null> {
  const col = await getCollection();
  
  // Convert string to ObjectId and find the document
  return col.findOne({ _id: new ObjectId(id) });
}
