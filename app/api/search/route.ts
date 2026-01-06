import { NextRequest, NextResponse } from 'next/server';
import { searchImages } from '@/lib/image/queries';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
    }
    const results = await searchImages(query);
    return NextResponse.json({ results });
  } catch (err: unknown) {
    const message = typeof err === 'object' && err && 'message' in err ? (err as any).message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 