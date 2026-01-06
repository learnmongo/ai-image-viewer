import { ObjectId } from 'mongodb';

export interface RawModelResponse {
  model: string;
  prompt?: string;
  response?: string;
}

export interface ImageDoc {
  _id: ObjectId;
  title: string;
  description: string;
  summary: string;
  feelings?: string[];
  hues?: string[];
  colors: string[];
  tags?: string[];
  raw?: RawModelResponse[];
}

/**
 * Client-safe version of ImageDoc with _id as string.
 * MongoDB ObjectIds are converted to strings for Next.js client components.
 */
export interface ImageItem extends Omit<ImageDoc, '_id'> {
  _id: string;
} 