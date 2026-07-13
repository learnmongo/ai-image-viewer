/** Re-exports for image MongoDB queries (see individual files for behavior). */

export { getCollection } from './base';
export {
  DEFAULT_LIMIT,
  DEFAULT_SEARCH_INDEX,
  DEFAULT_VECTOR_INDEX,
  DEFAULT_COLOR_THRESHOLD,
  DEFAULT_HYBRID_NUM_CANDIDATES,
  DEFAULT_HYBRID_BRANCH_LIMIT,
  DEFAULT_HYBRID_MIN_VECTOR_SIMILARITY,
  DEFAULT_HYBRID_VECTOR_MAX_GAP_FROM_BEST,
  DEFAULT_HYBRID_MIN_BEST_VECTOR_SCORE,
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
export { searchImagesHybrid } from './hybrid-search';
