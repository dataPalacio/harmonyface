import { notFound } from 'next/navigation';
import { getPatientById } from '@/lib/services/patients-service';
import { updatePatientAction } from '@/app/(dashboard)/patients/actions';
import Link from 'next/link';

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{patient.fullName}</h1>
        <div className="flex gap-2">
          <Link className="rounded-md border px-2 py-1 text-sm" href={`/patients/${patient.id}/anamnesis`}>
            Anamnese
          </Link>
          <Link className="rounded-md border px-2 py-1 text-sm" href={`/patients/${patient.id}/sessions`}>
            Sessões
          </Link>
          <Link className="rounded-md border px-2 py-1 text-sm" href={`/patients/${patient.id}/photos`}>
            Fotos
          </Link>
          <Link className="rounded-md border px-2 py-1 text-sm" href={`/patients/${patient.id}/financial`}>
            Financeiro
          </Link>
          <Link className="rounded-md border px-2 py-1 text-sm" href={`/patients/${patient.id}/consent`}>
            Consentimento
          </Link>
        </div>
      </div>

      <form action={updatePatientAction} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
        <input name="id" type="hidden" value={patient.id} />
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Nome completo</label>
          <input className="w-full rounded-md border px-3 py-2" defaultValue={patient.fullName} name="fullName" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">CPF *</label>
          <input className="w-full rounded-md border px-3 py-2" defaultValue={patient.cpf ?? ''} name="cpf" required maxLength={11} placeholder="Apenas 11 números" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Data de nascimento</label>
          <input className="w-full rounded-md border px-3 py-2" defaultValue={patient.birthDate ?? ''} name="birthDate" type="date" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Gênero</label>
          <input className="w-full rounded-md border px-3 py-2" defaultValue={patient.gender ?? ''} name="gender" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Telefone *</label>
          <input className="w-full rounded-md border px-3 py-2" defaultValue={patient.phone ?? ''} name="phone" required maxLength={11} placeholder="Apenas números (DDD + Tel)" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2" defaultValue={patient.email ?? ''} name="email" type="email" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Observações</label>
          <textarea className="min-h-24 w-full rounded-md border px-3 py-2" defaultValue={patient.notes ?? ''} name="notes" />
        </div>
        <div className="md:col-span-2">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white" type="submit">
            Salvar alterações
          </button>
        </div>
      </form>
    </section>
  );
}
