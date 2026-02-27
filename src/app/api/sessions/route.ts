import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { createSession, listSessionsByPatient } from '@/lib/services/sessions-service';

export async function GET(request: Request) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json({ error: 'Parâmetro patientId é obrigatório.' }, { status: 400 });
  }

  const sessions = await listSessionsByPatient(patientId);
  return NextResponse.json({ data: sessions });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as {
    patientId?: string;
    appointmentId?: string;
    date?: string;
    clinicalNotesRaw?: string;
    consentSigned?: boolean;
    procedureId?: string;
    facialRegion?: string;
    productUsed?: string;
    productLot?: string;
    quantity?: string;
    technique?: string;
    complications?: string;
  };

  if (!body.patientId || !body.date) {
    return NextResponse.json({ error: 'Campos patientId e date são obrigatórios.' }, { status: 400 });
  }

  const session = await createSession({
    patientId: body.patientId,
    appointmentId: body.appointmentId,
    date: body.date,
    clinicalNotesRaw: body.clinicalNotesRaw,
    consentSigned: body.consentSigned,
    procedureId: body.procedureId,
    facialRegion: body.facialRegion,
    productUsed: body.productUsed,
    productLot: body.productLot,
    quantity: body.quantity,
    technique: body.technique,
    complications: body.complications
  });

  if (!session) {
    return NextResponse.json({ error: 'Não foi possível criar a sessão.' }, { status: 400 });
  }

  return NextResponse.json({ data: session }, { status: 201 });
}
