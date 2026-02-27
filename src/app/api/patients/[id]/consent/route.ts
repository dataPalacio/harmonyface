import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/require-auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createConsent, getLatestConsent } from '@/lib/services/consent-service';

type RouteParams = { params: { id: string } };

export async function GET(_: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const consent = await getLatestConsent(params.id);
  return NextResponse.json({ data: consent });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  const body = (await request.json()) as {
    templateName?: string;
    termsText?: string;
    signatureName?: string;
  };

  if (!body.templateName || !body.termsText || !body.signatureName) {
    return NextResponse.json({ error: 'templateName, termsText e signatureName são obrigatórios.' }, { status: 400 });
  }

  const html = `
    <h1>${body.templateName}</h1>
    <p>${body.termsText}</p>
    <p>Assinado digitalmente por: <strong>${body.signatureName}</strong></p>
    <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
  `;

  const filename = `${params.id}/consent-${Date.now()}.html`;
  const supabase = createServerSupabaseClient();
  const upload = await supabase.storage.from('consents').upload(filename, html, {
    contentType: 'text/html',
    upsert: false
  });

  if (upload.error) {
    return NextResponse.json({ error: 'Falha ao gerar documento de consentimento.' }, { status: 400 });
  }

  const { data: publicData } = supabase.storage.from('consents').getPublicUrl(filename);

  const consent = await createConsent(
    {
      patientId: params.id,
      templateName: body.templateName,
      termsText: body.termsText,
      signatureName: body.signatureName
    },
    publicData.publicUrl
  );

  if (!consent) {
    return NextResponse.json({ error: 'Falha ao salvar consentimento.' }, { status: 400 });
  }

  return NextResponse.json({ data: consent }, { status: 201 });
}
