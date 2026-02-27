import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClinicalPhoto, listClinicalPhotosByPatient } from '@/lib/services/clinical-photos-service';

type RouteParams = { params: { id: string } };

export async function GET(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const photos = await listClinicalPhotosByPatient(params.id);
  return NextResponse.json({ data: photos });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 });
  }

  const procedureName = String(formData.get('procedureName') ?? '');
  const capturedAt = String(formData.get('capturedAt') ?? new Date().toISOString());
  const photoType = String(formData.get('photoType') ?? 'before') as 'before' | 'after';
  const consented = String(formData.get('consented') ?? 'false') === 'true';
  const sessionId = String(formData.get('sessionId') ?? '');

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const filename = `${params.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createServerSupabaseClient();
  const upload = await supabase.storage.from('clinical-photos').upload(filename, file, {
    contentType: file.type,
    upsert: false
  });

  if (upload.error) {
    return NextResponse.json({ error: 'Falha ao fazer upload da foto.' }, { status: 400 });
  }

  const { data: publicUrlData } = supabase.storage.from('clinical-photos').getPublicUrl(filename);

  const photo = await createClinicalPhoto({
    patientId: params.id,
    sessionId: sessionId || undefined,
    procedureName: procedureName || undefined,
    capturedAt,
    photoType,
    filePath: filename,
    fileUrl: publicUrlData.publicUrl,
    consented
  });

  if (!photo) {
    return NextResponse.json({ error: 'Falha ao salvar metadados da foto.' }, { status: 400 });
  }

  return NextResponse.json({ data: photo }, { status: 201 });
}
