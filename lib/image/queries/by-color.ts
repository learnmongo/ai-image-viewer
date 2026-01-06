import { getCollection, DEFAULT_LIMIT, DEFAULT_COLOR_THRESHOLD } from './base';
import { ImageDoc } from '@/types/image';
import { hexToRgb, colorDistance } from '../utils';

/**
 * Get images by fuzzy color match.
 * 
 * Example: Complex query that requires both MongoDB filtering and client-side processing.
 * We use aggregation to filter documents with colors, then calculate color distances
 * in JavaScript (since RGB distance calculation is complex).
 * 
 * This shows when to use aggregation ($match early) combined with client-side processing
 * for calculations that are difficult to express in MongoDB queries.
 * 
 * @param color - Hex color string (e.g. #FF0000 or FF0000)
 * @param threshold - RGB distance threshold (default: 60)
 * @param limit - Maximum number of results (default: 25)
 * @returns Promise resolving to an array of images with similar colors
 * 
 * @example
 * ```ts
 * // Find images with colors similar to red (within threshold of 60)
 * const images = await getImagesByColorFuzzy('#FF0000', 60);
 * ```
 */
export async function getImagesByColorFuzzy(
  color: string,
  threshold: number = DEFAULT_COLOR_THRESHOLD,
  limit: number = DEFAULT_LIMIT
): Promise<ImageDoc[]> {
  const col = await getCollection();
  
  // Normalize color format
  const normalizedColor = color.startsWith('#') ? color : `#${color}`;
  const targetRgb = hexToRgb(normalizedColor);
  
  // Step 1: Use aggregation to filter documents that have colors
  // This reduces the dataset before we process it in JavaScript
  const pipeline = [
    {
      $match: {
        colors: { $exists: true, $ne: [] } // Only documents with non-empty colors array
      }
    },
    {
      $sort: { _id: -1 } // Sort by newest first
    },
    {
      $limit: limit * 5 // Fetch more candidates than needed (since we'll filter by distance)
    }
  ];
  
  const candidates = await col.aggregate<ImageDoc>(pipeline).toArray();
  
  // Step 2: Calculate color distance for each candidate and filter by threshold
  const matches: Array<ImageDoc & { distance: number }> = [];
  
  for (const img of candidates) {
    // Find the closest color match in this image's color array
    let minDistance = Infinity;
    for (const colorHex of img.colors) {
      const colorRgb = hexToRgb(colorHex);
      const distance = colorDistance(colorRgb, targetRgb);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    
    // Include image if it has a color within the threshold
    if (minDistance <= threshold) {
      matches.push({ ...img, distance: minDistance });
    }
  }
  
  // Step 3: Sort by distance (best matches first), then limit results
  matches.sort((a, b) => {
    // Primary sort: by distance (lower is better)
    if (Math.abs(a.distance - b.distance) > 0.001) {
      return a.distance - b.distance;
    }
    // Secondary sort: by _id for stability
    return a._id.toString().localeCompare(b._id.toString());
  });
  
  // Return top matches, excluding the temporary distance field
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return matches.slice(0, limit).map(({ distance, ...img }) => img);
}
