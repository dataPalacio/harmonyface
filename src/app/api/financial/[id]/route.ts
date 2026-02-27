/**
 * API Route: Financial Record Detail
 * PATCH - Update a financial record
 * DELETE - Delete a financial record
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';
import {
  getFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
} from '@/lib/services/financial-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireApiUser();
    const body = await request.json();

    const existing = await getFinancialRecord(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Financial record not found' },
        { status: 404 }
      );
    }

    const record = await updateFinancialRecord(params.id, body);

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error('PATCH /api/financial/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update financial record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireApiUser();

    const existing = await getFinancialRecord(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Financial record not found' },
        { status: 404 }
      );
    }

    await deleteFinancialRecord(params.id);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('DELETE /api/financial/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete financial record' },
      { status: 500 }
    );
  }
}
