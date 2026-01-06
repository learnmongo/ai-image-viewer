import { Collection } from 'mongodb';
import clientPromise from '../../mongo';
import { ImageDoc } from '@/types/image';

/**
 * MongoDB database and collection configuration.
 */
export const COLLECTION_NAME = 'images';
export const DATABASE_NAME = 'seevector';

/**
 * Default values for queries.
 */
export const DEFAULT_LIMIT = 25;
export const DEFAULT_SEARCH_INDEX = 'ix_text';
export const DEFAULT_COLOR_THRESHOLD = 60;

/**
 * Get the MongoDB collection for images.
 * 
 * Example: Getting a collection reference.
 * All queries use this helper to get the collection instance.
 * 
 * @returns Promise resolving to the images collection
 */
export async function getCollection(): Promise<Collection<ImageDoc>> {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<ImageDoc>(COLLECTION_NAME);
}
