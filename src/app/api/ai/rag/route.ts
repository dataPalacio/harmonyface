import { NextRequest, NextResponse } from 'next/server';
import { queryRAG } from '@/lib/services/rag-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { query?: string; topK?: number };
    const query = body.query || '';

    if (!query || typeof query !== 'string' || query.trim().length < 5) {
      return NextResponse.json(
        { error: 'Query must be provided and at least 5 characters' },
        { status: 400 }
      );
    }

    // Perform RAG query
    const result = await queryRAG({
      question: query,
      topK: body.topK || 5,
    });

    return NextResponse.json({
      data: result,
      disclaimer: result.disclaimer,
    });
  } catch (error) {
    console.error('RAG API error:', error);
    return NextResponse.json(
      { error: 'Failed to process RAG query' },
      { status: 500 }
    );
  }
}
