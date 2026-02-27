import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { deletePatient, getPatientById, updatePatient } from '@/lib/services/patients-service';

type RouteParams = { params: { id: string } };

export async function GET(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const patient = await getPatientById(params.id);
  if (!patient) {
    return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ data: patient });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as Record<string, unknown>;
  const patient = await updatePatient(params.id, body);

  if (!patient) {
    return NextResponse.json({ error: 'Não foi possível atualizar o paciente.' }, { status: 400 });
  }

  return NextResponse.json({ data: patient });
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const ok = await deletePatient(params.id);
  if (!ok) {
    return NextResponse.json({ error: 'Não foi possível remover o paciente.' }, { status: 400 });
  }

  return NextResponse.json({ data: { deleted: true } });
}
