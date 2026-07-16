import { searchImages, searchImagesHybrid } from '@/lib/image/queries';
import { toImageArray } from '@/lib/image/utils';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST body: `{ query: string, hybrid?: boolean }`
 * - `hybrid === true` → `searchImagesHybrid` (vector + text, fused).
 * - otherwise → `searchImages` (keywords only).
 * JSON: `{ results: Image[] }` with each item’s `score` from the chosen pipeline.
 */
export async function POST(req: NextRequest) {
  const { query, hybrid } = await req.json();
  const results = hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
  const images = toImageArray(results).map((img, i) => ({
    ...img,
    score: results[i]?.score,
  }));
  return NextResponse.json({ results: images });
}
