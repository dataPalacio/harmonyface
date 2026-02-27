'use server';

import { revalidatePath } from 'next/cache';
import { upsertAnamnesis } from '@/lib/services/anamnesis-service';

function splitCsv(input: string): string[] {
  return input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function upsertAnamnesisAction(
  formData: FormData
)
{
  const patientId = String(formData.get('patientId') ?? '');
  if (!patientId) {
    return;
  }

  const allergies = splitCsv(String(formData.get('allergies') ?? '')).map((substance) => ({ substance }));
  const currentMedications = splitCsv(String(formData.get('currentMedications') ?? ''));
  const previousProcedures = splitCsv(String(formData.get('previousProcedures') ?? ''));
  const medicalConditions = splitCsv(String(formData.get('medicalConditions') ?? ''));

  const result = await upsertAnamnesis({
    patientId,
    allergies,
    currentMedications,
    previousProcedures,
    medicalConditions,
    expectations: String(formData.get('expectations') ?? ''),
    fitzpatrickSkinType: String(formData.get('fitzpatrickSkinType') ?? '')
  });

  if (!result) {
    return;
  }

  revalidatePath(`/patients/${patientId}/anamnesis`);
  revalidatePath(`/patients/${patientId}`);
}
