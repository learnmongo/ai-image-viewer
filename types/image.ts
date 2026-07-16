import { ObjectId } from 'mongodb';

/** One model call: legacy `raw[]` or newer `prompt_debug[]`. */
export interface RawModelResponse {
  model: string;
  /** Newer pipeline (e.g. process tool version). */
  version?: string;
  prompt?: string;
  /** Plain text or structured JSON object from the model. */
  response?: string | Record<string, unknown> | unknown[];
}

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number, number]; // [lng, lat, alt]
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
  /** Original image filename in assets. */
  file: string;
  /** GPS from EXIF when available. */
  location: GeoJsonPoint | null;
  /** Legacy model traces. */
  raw?: RawModelResponse[];
  /** Newer model traces (same shape as `raw`, preferred when non-empty). */
  prompt_debug?: RawModelResponse[];
  /** Present after running generate-embeddings. */
  embedding?: number[];
  embedding_model?: string;
  embedding_date?: Date;
}

/** Prefer `prompt_debug` when non-empty; otherwise legacy `raw`. */
export function getModelResponseEntries(
  doc: Pick<ImageDoc, 'raw' | 'prompt_debug'>,
): RawModelResponse[] {
  const { prompt_debug: debug, raw } = doc;
  if (debug != null && debug.length > 0) return debug;
  return raw ?? [];
}

/**
 * Client-safe version of ImageDoc with _id as string.
 * MongoDB ObjectIds are converted to strings for Next.js client components.
 */
export interface ImageItem extends Omit<ImageDoc, '_id'> {
  _id: string;
}
