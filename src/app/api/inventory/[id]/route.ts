/**
 * API Route: Inventory Item Detail
 * PATCH - Update an inventory item
 * DELETE - Soft delete an inventory item (deactivate)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';
import {
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '@/lib/services/inventory-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireApiUser();
    const body = await request.json();

    const existing = await getInventoryItem(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    const item = await updateInventoryItem(params.id, body);

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PATCH /api/inventory/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
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

    const existing = await getInventoryItem(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    await deleteInventoryItem(params.id);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('DELETE /api/inventory/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}
