import { NextRequest, NextResponse } from 'next/server';
import { searchImages } from '@/lib/image/queries';
import { toImageArray } from '@/lib/image/serialize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid query' }, 
        { status: 400 }
      );
    }
    
    const results = await searchImages(query);
    // Convert ObjectIds to strings for client components (Next.js requirement)
    const images = toImageArray(results).map((img, index) => ({
      ...img,
      score: results[index]?.score
    }));
    
    return NextResponse.json({ results: images });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
} 