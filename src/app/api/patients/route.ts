import { NextResponse } from 'next/server';
import { createPatient, listPatients } from '@/lib/services/patients-service';
import { requireApiUser } from '@/lib/auth/require-auth';

export async function GET() {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const patients = await listPatients();
  return NextResponse.json({ data: patients });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as {
    fullName?: string;
    cpf?: string;
    birthDate?: string;
    gender?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };

  const patient = await createPatient(body);
  if (!patient) {
    return NextResponse.json({ error: 'Não foi possível criar o paciente.' }, { status: 400 });
  }

  return NextResponse.json({ data: patient }, { status: 201 });
}
