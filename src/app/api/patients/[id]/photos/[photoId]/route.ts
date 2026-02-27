import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { deleteClinicalPhoto } from '@/lib/services/clinical-photos-service';

type RouteParams = { params: { id: string; photoId: string } };

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const ok = await deleteClinicalPhoto(params.photoId);
  if (!ok) {
    return NextResponse.json({ error: 'Não foi possível excluir a foto clínica.' }, { status: 400 });
  }

  return NextResponse.json({ data: { deleted: true } });
}
