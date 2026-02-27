'use server';

import { revalidatePath } from 'next/cache';
import { createSession } from '@/lib/services/sessions-service';

export async function createSessionAction(formData: FormData) {
  const patientId = String(formData.get('patientId') ?? '');
  const date = String(formData.get('date') ?? '');

  if (!patientId || !date) {
    return;
  }

  await createSession({
    patientId,
    appointmentId: String(formData.get('appointmentId') ?? '') || undefined,
    date,
    clinicalNotesRaw: String(formData.get('clinicalNotesRaw') ?? '') || undefined,
    consentSigned: String(formData.get('consentSigned') ?? 'false') === 'true',
    procedureId: String(formData.get('procedureId') ?? '') || undefined,
    facialRegion: String(formData.get('facialRegion') ?? '') || undefined,
    productUsed: String(formData.get('productUsed') ?? '') || undefined,
    productLot: String(formData.get('productLot') ?? '') || undefined,
    quantity: String(formData.get('quantity') ?? '') || undefined,
    technique: String(formData.get('technique') ?? '') || undefined,
    complications: String(formData.get('complications') ?? '') || undefined
  });

  revalidatePath(`/patients/${patientId}/sessions`);
  revalidatePath(`/patients/${patientId}`);
}
