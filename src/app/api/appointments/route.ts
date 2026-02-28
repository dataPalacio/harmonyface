import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { createAppointment, listAppointments } from '@/lib/services/appointments-service';

export async function GET() {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const appointments = await listAppointments();
  return NextResponse.json({ data: appointments });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as {
    patientId?: string;
    procedureId?: string;
    appointmentType?: string;
    roomName?: string;
    scheduledAt?: string;
    durationMin?: number;
    status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    isBlocked?: boolean;
  };

  if (!body.scheduledAt) {
    return NextResponse.json({ error: 'Campo scheduledAt é obrigatório.' }, { status: 400 });
  }

  const appointment = await createAppointment({
    patientId: body.patientId,
    procedureId: body.procedureId,
    appointmentType: body.appointmentType,
    roomName: body.roomName,
    scheduledAt: body.scheduledAt,
    durationMin: body.durationMin,
    status: body.status,
    notes: body.notes,
    isBlocked: body.isBlocked
  });

  if (!appointment) {
    return NextResponse.json({ error: 'Não foi possível criar o agendamento.' }, { status: 400 });
  }

  return NextResponse.json({ data: appointment }, { status: 201 });
}
