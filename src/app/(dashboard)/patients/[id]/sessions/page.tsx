import { notFound } from 'next/navigation';
import { createSessionAction } from './actions';
import { getPatientById } from '@/lib/services/patients-service';
import { listSessionsByPatient } from '@/lib/services/sessions-service';
import { listActiveProcedures } from '@/lib/services/procedure-catalog-service';

export default async function SessionsPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  const [sessions, procedures] = await Promise.all([listSessionsByPatient(params.id), listActiveProcedures()]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Sessões clínicas — {patient.fullName}</h1>

      <form action={createSessionAction} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
        <input name="patientId" type="hidden" value={params.id} />
        <input className="rounded-md border px-3 py-2" name="date" required type="datetime-local" />

        <select className="rounded-md border px-3 py-2" name="procedureId">
          <option value="">Procedimento</option>
          {procedures.map((procedure) => (
            <option key={procedure.id} value={procedure.id}>
              {procedure.name}
            </option>
          ))}
        </select>

        <input className="rounded-md border px-3 py-2" name="facialRegion" placeholder="Região facial" />
        <input className="rounded-md border px-3 py-2" name="productUsed" placeholder="Produto utilizado" />
        <input className="rounded-md border px-3 py-2" name="productLot" placeholder="Lote" />
        <input className="rounded-md border px-3 py-2" name="quantity" placeholder="Quantidade" />
        <input className="rounded-md border px-3 py-2" name="technique" placeholder="Técnica aplicada" />

        <select className="rounded-md border px-3 py-2" defaultValue="false" name="consentSigned">
          <option value="false">Sem termo assinado</option>
          <option value="true">Com termo assinado</option>
        </select>

        <input className="rounded-md border px-3 py-2" name="complications" placeholder="Intercorrências" />

        <textarea className="min-h-24 rounded-md border px-3 py-2 md:col-span-2" name="clinicalNotesRaw" placeholder="Anotação clínica livre" />

        <div className="md:col-span-2">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white" type="submit">
            Registrar sessão
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {sessions.map((session) => (
          <article className="rounded-lg border bg-white p-4" key={session.id}>
            <p className="font-medium">{new Date(session.date).toLocaleString('pt-BR')}</p>
            <p className="text-sm text-slate-600">Consentimento: {session.consentSigned ? 'assinado' : 'pendente'}</p>
            <p className="mt-2 text-sm text-slate-700">{session.clinicalNotesRaw ?? 'Sem observações clínicas.'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
