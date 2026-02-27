'use client';

import { useState } from 'react';
import type { Consent } from '@/types/consent';

type Props = {
  patientId: string;
  initialConsent: Consent | null;
};

const defaultTerms =
  'Declaro que fui orientado(a) sobre indicações, benefícios, riscos, possíveis intercorrências, cuidados pós-procedimento e alternativas terapêuticas. Autorizo a realização do procedimento de harmonização facial de forma livre e esclarecida.';

export function ConsentForm({ patientId, initialConsent }: Props) {
  const [latest, setLatest] = useState<Consent | null>(initialConsent);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    try {
      const payload = {
        templateName: String(formData.get('templateName') ?? 'Termo de Consentimento'),
        termsText: String(formData.get('termsText') ?? defaultTerms),
        signatureName: String(formData.get('signatureName') ?? '')
      };

      const response = await fetch(`/api/patients/${patientId}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const json = (await response.json()) as { data: Consent };
        setLatest(json.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <form action={onSubmit} className="space-y-3 rounded-lg border bg-white p-4">
        <input className="w-full rounded-md border px-3 py-2" defaultValue="Termo de Consentimento - Harmonização Facial" name="templateName" required />
        <textarea className="min-h-40 w-full rounded-md border px-3 py-2" defaultValue={defaultTerms} name="termsText" required />
        <input className="w-full rounded-md border px-3 py-2" name="signatureName" placeholder="Nome completo para assinatura eletrônica" required />

        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70" disabled={loading} type="submit">
          {loading ? 'Assinando...' : 'Assinar termo digital'}
        </button>
      </form>

      {latest ? (
        <div className="rounded-lg border bg-white p-4 text-sm">
          <p className="font-medium">Último termo assinado</p>
          <p>Assinante: {latest.signatureName}</p>
          <p>Data: {new Date(latest.signedAt).toLocaleString('pt-BR')}</p>
          {latest.documentUrl ? (
            <a className="text-blue-700 underline" href={latest.documentUrl} rel="noreferrer" target="_blank">
              Abrir documento assinado
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
