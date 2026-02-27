'use client';

import { useState } from 'react';
import type { ClinicalPhoto } from '@/types/clinical-photo';

type Props = {
  patientId: string;
  initialPhotos: ClinicalPhoto[];
};

export function PhotosGallery({ patientId, initialPhotos }: Props) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const response = await fetch(`/api/patients/${patientId}/photos`, { cache: 'no-store' });
    const json = (await response.json()) as { data: ClinicalPhoto[] };
    setPhotos(json.data ?? []);
  }

  async function onUpload(formData: FormData) {
    setLoading(true);

    try {
      const response = await fetch(`/api/patients/${patientId}/photos`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(photoId: string) {
    await fetch(`/api/patients/${patientId}/photos/${photoId}`, { method: 'DELETE' });
    await refresh();
  }

  return (
    <section className="space-y-4">
      <form action={onUpload} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
        <input accept="image/*" className="rounded-md border px-3 py-2" name="file" required type="file" />
        <input className="rounded-md border px-3 py-2" name="procedureName" placeholder="Procedimento" />
        <input className="rounded-md border px-3 py-2" name="capturedAt" required type="datetime-local" />

        <select className="rounded-md border px-3 py-2" defaultValue="before" name="photoType">
          <option value="before">Antes</option>
          <option value="after">Depois</option>
        </select>

        <select className="rounded-md border px-3 py-2" defaultValue="true" name="consented">
          <option value="true">Com consentimento de imagem</option>
          <option value="false">Sem consentimento de imagem</option>
        </select>

        <div className="md:col-span-2">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70" disabled={loading} type="submit">
            {loading ? 'Enviando...' : 'Enviar foto clínica'}
          </button>
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo) => (
          <article className="overflow-hidden rounded-lg border bg-white" key={photo.id}>
            <img alt={photo.procedureName ?? 'Foto clínica'} className="h-52 w-full object-cover" src={photo.fileUrl} />
            <div className="space-y-1 p-3 text-sm">
              <p className="font-medium">
                {photo.photoType === 'before' ? 'Antes' : 'Depois'} •{' '}
                {new Date(photo.capturedAt).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-slate-600">{photo.procedureName ?? 'Sem procedimento informado'}</p>
              <p className="text-slate-600">{photo.consented ? 'Consentimento: sim' : 'Consentimento: não'}</p>
              <button className="mt-2 rounded-md border px-2 py-1 text-xs text-red-700" onClick={() => onDelete(photo.id)} type="button">
                Excluir foto
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
