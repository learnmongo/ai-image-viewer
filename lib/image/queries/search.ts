import { getCollection, DEFAULT_LIMIT, DEFAULT_SEARCH_INDEX } from './base';
import { ImageDoc } from '@/types/image';

/**
 * Search images using MongoDB Atlas Search.
 * 
 * Example: Aggregation pipeline with Atlas Search $search stage.
 * Atlas Search requires aggregation and must be the first stage in the pipeline.
 * 
 * Requires an Atlas Search index named 'ix_text' (or custom index).
 * Set up in Atlas: Search > Create Search Index > Define on collection 'images'
 * 
 * @param query - Search query text
 * @param limit - Maximum number of results to return (default: 25)
 * @param textIndex - Name of the Atlas Search index to use (default: 'ix_text')
 * @returns Promise resolving to an array of images with search scores
 * 
 * @example
 * ```ts
 * // Basic search
 * const results = await searchImages('sunset nature');
 * 
 * // Search with custom limit and index
 * const results = await searchImages('beach', 50, 'my_custom_index');
 * ```
 */
export async function searchImages(
  query: string,
  limit: number = DEFAULT_LIMIT,
  textIndex: string = DEFAULT_SEARCH_INDEX
): Promise<(ImageDoc & { score: number })[]> {
  // Validate query
  if (!query || query.trim().length === 0) {
    return [];
  }

  const col = await getCollection();

  // Atlas Search requires aggregation pipeline
  // The $search stage MUST be the first stage
  const pipeline = [
    // Stage 1: Atlas Search - finds documents matching the text query
    {
      $search: {
        index: textIndex,
        text: {
          query: query.trim(),
          path: {
            wildcard: '*' // Search all fields configured in the index
          }
        }
      }
    },
    // Stage 2: Add the search relevance score as a field
    {
      $addFields: {
        score: { $meta: 'searchScore' }
      }
    },
    // Stage 3: Sort by relevance (score), then by _id for consistency
    {
      $sort: { 
        score: -1,  // Higher score = more relevant
        _id: -1     // Tie-breaker: newest first
      }
    },
    // Stage 4: Limit results
    {
      $limit: limit
    }
  ];

  return col.aggregate<ImageDoc & { score: number }>(pipeline).toArray();
}
