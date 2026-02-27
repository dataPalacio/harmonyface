import { NextRequest, NextResponse } from 'next/server';
import { checkSessionCompliance, generateComplianceReport } from '@/lib/services/compliance-service';
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

    const body = (await request.json()) as {
      sessionId: string;
      session?: Record<string, unknown>;
      patientId?: string;
      startDate?: string;
      endDate?: string;
    };

    const { sessionId, session, patientId, startDate, endDate } = body;

    // If specific session compliance is requested
    if (sessionId && session) {
      const result = await checkSessionCompliance(sessionId, session);
      return NextResponse.json({ data: result });
    }

    // If batch compliance report is requested
    if (patientId || (startDate && endDate)) {
      const report = await generateComplianceReport(patientId, {
        startDate: startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString(),
      });
      return NextResponse.json({ data: report });
    }

    return NextResponse.json(
      { error: 'Either sessionId+session or patientId/daterange must be provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Compliance API error:', error);
    return NextResponse.json(
      { error: 'Failed to check compliance' },
      { status: 500 }
    );
  }
}
