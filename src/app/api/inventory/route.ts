/**
 * API Route: Inventory Items
 * GET - List all active inventory items
 * POST - Create a new inventory item
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';
import {
  listInventoryItems,
  createInventoryItem,
} from '@/lib/services/inventory-service';

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser();

    const items = await listInventoryItems();

    return NextResponse.json({
      data: items,
    });
  } catch (error) {
    console.error('GET /api/inventory error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser();
    const body = await request.json();

    if (!body.productName || !body.unit || body.minStockLevel === undefined || body.maxStockLevel === undefined || body.unitCost === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, unit, minStockLevel, maxStockLevel, unitCost' },
        { status: 400 }
      );
    }

    const item = await createInventoryItem(body);

    return NextResponse.json(
      { data: item },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/inventory error:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
