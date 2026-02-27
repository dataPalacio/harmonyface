import Link from 'next/link';
import type { Patient } from '@/types/patient';
import { createPatientAction, deletePatientAction } from '@/app/(dashboard)/patients/actions';

type PatientsOverviewProps = {
  patients: Patient[];
};

export function PatientsOverview({ patients }: PatientsOverviewProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pacientes</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <form action={createPatientAction} className="space-y-3 rounded-lg border bg-white p-4">
          <h2 className="text-lg font-medium">Novo paciente</h2>
          <input className="w-full rounded-md border px-3 py-2" name="fullName" placeholder="Nome completo" required />
          <input className="w-full rounded-md border px-3 py-2" name="cpf" placeholder="CPF" />
          <input className="w-full rounded-md border px-3 py-2" name="birthDate" type="date" />
          <input className="w-full rounded-md border px-3 py-2" name="phone" placeholder="Telefone" />
          <input className="w-full rounded-md border px-3 py-2" name="email" placeholder="Email" type="email" />
          <textarea className="min-h-20 w-full rounded-md border px-3 py-2" name="notes" placeholder="Observações" />
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white" type="submit">
            Salvar paciente
          </button>
        </form>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-medium">Lista de pacientes</h2>
          <ul className="space-y-3">
            {patients.map((patient) => (
              <li className="rounded-md border p-3" key={patient.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{patient.fullName}</p>
                    <p className="text-sm text-slate-600">{patient.phone ?? 'Sem telefone'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link className="rounded-md border px-2 py-1 text-sm" href={`/patients/${patient.id}`}>
                      Abrir
                    </Link>
                    <form action={deletePatientAction}>
                      <input name="id" type="hidden" value={patient.id} />
                      <button className="rounded-md border px-2 py-1 text-sm text-red-700" type="submit">
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
