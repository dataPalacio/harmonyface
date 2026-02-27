import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { getAnamnesisByPatientId, upsertAnamnesis } from '@/lib/services/anamnesis-service';

type RouteParams = { params: { id: string } };

export async function GET(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const anamnesis = await getAnamnesisByPatientId(params.id);
  return NextResponse.json({ data: anamnesis });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as Record<string, unknown>;
  const anamnesis = await upsertAnamnesis({
    patientId: params.id,
    allergies: Array.isArray(body.allergies) ? (body.allergies as { substance: string; severity?: string; notes?: string }[]) : [],
    currentMedications: Array.isArray(body.currentMedications) ? (body.currentMedications as string[]) : [],
    previousProcedures: Array.isArray(body.previousProcedures) ? (body.previousProcedures as string[]) : [],
    medicalConditions: Array.isArray(body.medicalConditions) ? (body.medicalConditions as string[]) : [],
    expectations: typeof body.expectations === 'string' ? body.expectations : undefined,
    fitzpatrickSkinType: typeof body.fitzpatrickSkinType === 'string' ? body.fitzpatrickSkinType : undefined
  });

  if (!anamnesis) {
    return NextResponse.json({ error: 'Não foi possível salvar a anamnese.' }, { status: 400 });
  }

  return NextResponse.json({ data: anamnesis });
}
