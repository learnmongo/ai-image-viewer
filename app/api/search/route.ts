import { NextRequest, NextResponse } from 'next/server';
import { searchImages } from '@/lib/image/queries';

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
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
} 