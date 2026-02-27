import { NextRequest, NextResponse } from 'next/server';
import { summarizeSession } from '@/lib/services/summarization-service';
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

    const body = (await request.json()) as { sessionId?: string; clinicalNotes?: string };
    const { sessionId, clinicalNotes } = body;

    if (!sessionId || !clinicalNotes) {
      return NextResponse.json(
        { error: 'sessionId and clinicalNotes are required' },
        { status: 400 }
      );
    }

    if (clinicalNotes.trim().length < 10) {
      return NextResponse.json(
        { error: 'Clinical notes must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Perform summarization
    const summary = await summarizeSession(sessionId, clinicalNotes);

    return NextResponse.json({
      data: summary,
      disclaimer: '⚠️ Resumo gerado automaticamente por IA. Revise e confirme todas as informações antes de salvar.',
    });
  } catch (error) {
    console.error('Summarization API error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize session' },
      { status: 500 }
    );
  }
}
