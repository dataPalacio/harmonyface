import { NextRequest, NextResponse } from 'next/server';
import { performNER } from '@/lib/services/ner-service';
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

    const body = (await request.json()) as { clinicalText?: string; notes?: string };
    const text = body.clinicalText || body.notes || '';

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Clinical text must be provided and at least 10 characters' },
        { status: 400 }
      );
    }

    // Perform NER
    const result = await performNER(text);

    return NextResponse.json({
      data: result,
      disclaimer: '⚠️ Extração gerada por IA. Revise e confirme todas as informações antes de salvar.',
    });
  } catch (error) {
    console.error('NER API error:', error);
    return NextResponse.json(
      { error: 'Failed to process NER request' },
      { status: 500 }
    );
  }
}
