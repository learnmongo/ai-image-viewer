/**
 * MongoDB query examples for images.
 * 
 * This module provides clear, simple examples of different MongoDB query patterns:
 * 
 * Simple queries (using .find()):
 * - getImageById - Find one document by _id
 * - getImagesByTag - Array field matching
 * - getLatestImages - Simple find with sorting
 * 
 * Complex queries (using aggregation):
 * - searchImages - Atlas Search (requires aggregation)
 * - getImagesByColorFuzzy - Hybrid MongoDB + JavaScript processing
 * 
 * All queries use the shared MongoDB client connection from lib/mongo.ts
 */

// Base utilities and constants
export { getCollection } from './base';
export { 
  DEFAULT_LIMIT, 
  DEFAULT_SEARCH_INDEX, 
  DEFAULT_COLOR_THRESHOLD 
} from './base';

// Query functions
export { getImageById } from './by-id';
export { 
  getImagesByTag,
  getImagesByFeeling,
  getImagesByHue,
  getImagesByExactColor 
} from './by-array-field';
export { getImagesByColorFuzzy } from './by-color';
export { getLatestImages } from './latest';
export { searchImages } from './search';
