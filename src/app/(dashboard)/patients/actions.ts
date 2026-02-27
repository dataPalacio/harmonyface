'use server';

import { revalidatePath } from 'next/cache';
import { createPatient, deletePatient, updatePatient } from '@/lib/services/patients-service';

import { CreatePatientSchema, type CreatePatientInput } from '@/lib/validations/patient-schema';

export async function createPatientAction(data: CreatePatientInput) {
  const result = CreatePatientSchema.safeParse(data);
  
  if (!result.success) {
    return { error: 'Dados inválidos', details: result.error.flatten().fieldErrors };
  }

  const patient = await createPatient({
    fullName: result.data.fullName,
    cpf: result.data.cpf,
    birthDate: result.data.birthDate,
    phone: result.data.phone,
    email: result.data.email,
    notes: result.data.notes,
  });

  if (!patient) {
    console.error('Falha ao criar paciente: createPatient retornou null');
    return { error: 'Erro ao criar paciente no banco de dados. Verifique os campos ou tente novamente.' };
  }

  revalidatePath('/patients');
  return { success: true, patient };
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
