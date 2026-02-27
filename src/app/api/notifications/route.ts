/**
 * Notifications API
 * Send email notifications and process reminders
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  sendEmail,
  sendAppointmentReminder,
  sendReturnReminder,
  processDueReminders,
  sendLowStockAlert,
  sendExpiryAlert,
} from '@/lib/services/notification-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
    }

    let result: any;

    switch (action) {
      case 'send_email':
        if (!data?.to || !data?.subject || !data?.body) {
          return NextResponse.json({ error: 'Missing email fields' }, { status: 400 });
        }
        result = await sendEmail(data);
        break;

      case 'appointment_reminder':
        if (!data?.appointmentId) {
          return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
        }
        result = await sendAppointmentReminder(data.appointmentId);
        break;

      case 'return_reminder':
        if (!data?.sessionId) {
          return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }
        result = await sendReturnReminder(data.sessionId);
        break;

      case 'process_due_reminders':
        // This can be called by a cron job
        result = await processDueReminders();
        break;

      case 'low_stock_alert':
        if (!data?.productId) {
          return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        }
        result = await sendLowStockAlert(data.productId);
        break;

      case 'expiry_alert':
        if (!data?.productId) {
          return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        }
        result = await sendExpiryAlert(data.productId);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
