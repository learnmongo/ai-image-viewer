import { ImageDoc } from '@/types/image';

/**
 * Client-safe version of ImageDoc with _id as string.
 * MongoDB ObjectIds are converted to strings for Next.js client components.
 */
export interface ImageItem extends Omit<ImageDoc, '_id'> {
  _id: string;
}

/**
 * Converts ImageDoc (with ObjectId) to ImageItem (with string id) for client components.
 * This is the recommended approach for Next.js when passing MongoDB documents to client components.
 */
export function toImage(doc: ImageDoc): ImageItem {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

/**
 * Converts an array of ImageDoc to ImageItem.
 */
export function toImageArray(docs: ImageDoc[]): ImageItem[] {
  return docs.map(toImage);
}

