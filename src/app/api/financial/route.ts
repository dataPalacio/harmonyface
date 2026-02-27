/**
 * API Route: Financial Records
 * GET - List financial records by patientId query param
 * POST - Create a new financial record
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';
import {
  listFinancialRecordsByPatient,
  createFinancialRecord,
  getFinancialSummary,
} from '@/lib/services/financial-service';

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser();
    const patientId = request.nextUrl.searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json(
        { error: 'patientId query parameter is required' },
        { status: 400 }
      );
    }

    const records = await listFinancialRecordsByPatient(patientId);
    const summary = await getFinancialSummary(patientId);

    return NextResponse.json({
      data: records,
      summary,
    });
  } catch (error) {
    console.error('GET /api/financial error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser();
    const body = await request.json();

    if (!body.patientId || !body.recordType || !body.description || body.totalAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, recordType, description, totalAmount' },
        { status: 400 }
      );
    }

    const record = await createFinancialRecord(body);

    return NextResponse.json(
      { data: record },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/financial error:', error);
    return NextResponse.json(
      { error: 'Failed to create financial record' },
      { status: 500 }
    );
  }
}
