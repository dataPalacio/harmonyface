import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { deleteAppointment, updateAppointment } from '@/lib/services/appointments-service';

type RouteParams = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as {
    patientId?: string;
    procedureId?: string;
    appointmentType?: string;
    roomName?: string;
    scheduledAt?: string;
    durationMin?: number;
    status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'blocked';
    notes?: string;
    isBlocked?: boolean;
  };

  const appointment = await updateAppointment(params.id, body);
  if (!appointment) {
    return NextResponse.json({ error: 'Não foi possível atualizar o agendamento.' }, { status: 400 });
  }

  return NextResponse.json({ data: appointment });
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const ok = await deleteAppointment(params.id);
  if (!ok) {
    return NextResponse.json({ error: 'Não foi possível excluir o agendamento.' }, { status: 400 });
  }

  return NextResponse.json({ data: { deleted: true } });
}
