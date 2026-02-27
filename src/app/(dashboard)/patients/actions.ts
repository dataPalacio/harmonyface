'use server';

import { revalidatePath } from 'next/cache';
import { createPatient, deletePatient, updatePatient } from '@/lib/services/patients-service';

export async function createPatientAction(formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '').trim();
  if (!fullName) {
    return;
  }

  const patient = await createPatient({
    fullName,
    cpf: String(formData.get('cpf') ?? ''),
    birthDate: String(formData.get('birthDate') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    notes: String(formData.get('notes') ?? '')
  });

  if (!patient) {
    return;
  }

  revalidatePath('/patients');
}

export async function deletePatientAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await deletePatient(id);
  revalidatePath('/patients');
}

export async function updatePatientAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) {
    return;
  }

  const result = await updatePatient(id, {
    fullName: String(formData.get('fullName') ?? ''),
    cpf: String(formData.get('cpf') ?? ''),
    birthDate: String(formData.get('birthDate') ?? ''),
    gender: String(formData.get('gender') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    notes: String(formData.get('notes') ?? '')
  });

  if (!result) {
    return;
  }

  revalidatePath(`/patients/${id}`);
  revalidatePath('/patients');
}
