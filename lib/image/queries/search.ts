import { getCollection, DEFAULT_LIMIT, DEFAULT_SEARCH_INDEX } from './base';
import { ATLAS_TEXT_SEARCH_PATHS } from './text-search-paths';
import { ImageDoc } from '@/types/image';

/**
 * Text-only image search — aggregation shape:
 *
 * 1. `$search` — score documents by keyword relevance on `ATLAS_TEXT_SEARCH_PATHS`.
 * 2. `$addFields` — copy Atlas text relevance into `score` (`$meta: 'searchScore'`).
 * 3. `$sort` / `$limit` — best matches first, then cap count.
 *
 * Use `textIndex` that matches your Search index definition (default `ix_text` in `base.ts`).
 */
export async function searchImages(
  query: string,
  limit: number = DEFAULT_LIMIT,
  textIndex: string = DEFAULT_SEARCH_INDEX
): Promise<(ImageDoc & { score: number })[]> {
  const q = query?.trim() ?? '';
  if (!q) return [];

  const col = await getCollection();

  const pipeline = [
    {
      $search: {
        index: textIndex,
        text: {
          query: q,
          path: [...ATLAS_TEXT_SEARCH_PATHS],
        },
      },
    },

    { $addFields: { score: { $meta: 'searchScore' } } },

    { $sort: { score: -1, _id: -1 } },
    { $limit: limit },
  ];

  return col.aggregate<ImageDoc & { score: number }>(pipeline).toArray();
}
