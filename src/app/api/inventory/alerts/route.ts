/**
 * API Route: Inventory Alerts & Dashboard
 * GET - Get inventory dashboard with alerts
 * POST - Create or resolve alerts manually
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';
import {
  getInventoryDashboard,
  resolveAlert,
} from '@/lib/services/inventory-service';

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser();

    const dashboard = await getInventoryDashboard();

    return NextResponse.json({
      data: dashboard,
    });
  } catch (error) {
    console.error('GET /api/inventory/alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory dashboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser();
    const body = await request.json();

    if (!body.alertId) {
      return NextResponse.json(
        { error: 'Missing alertId in request body' },
        { status: 400 }
      );
    }

    // Resolve alert
    await resolveAlert(body.alertId);

    return NextResponse.json({ resolved: true });
  } catch (error) {
    console.error('POST /api/inventory/alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}
