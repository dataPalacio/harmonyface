import { notFound } from 'next/navigation';
import { getAnamnesisByPatientId } from '@/lib/services/anamnesis-service';
import { getPatientById } from '@/lib/services/patients-service';
import { upsertAnamnesisAction } from './actions';

function joinCsv(values: string[]) {
  return values.join(', ');
}

export default async function AnamnesisPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  const anamnesis = await getAnamnesisByPatientId(params.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Anamnese — {patient.fullName}</h1>
      <form action={upsertAnamnesisAction} className="space-y-3 rounded-lg border bg-white p-4">
        <input name="patientId" type="hidden" value={params.id} />

        <div className="space-y-1">
          <label className="text-sm font-medium">Alergias (separadas por vírgula)</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            defaultValue={joinCsv((anamnesis?.allergies ?? []).map((item) => item.substance))}
            name="allergies"
            placeholder="Lidocaína, Ácido hialurônico"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Medicações em uso (vírgula)</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            defaultValue={joinCsv(anamnesis?.currentMedications ?? [])}
            name="currentMedications"
            placeholder="Isotretinoína, Anticoagulante"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Procedimentos anteriores (vírgula)</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            defaultValue={joinCsv(anamnesis?.previousProcedures ?? [])}
            name="previousProcedures"
            placeholder="Botox frontal, Preenchimento labial"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Condições médicas relevantes (vírgula)</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            defaultValue={joinCsv(anamnesis?.medicalConditions ?? [])}
            name="medicalConditions"
            placeholder="Diabetes, Herpes labial recorrente"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Expectativas do paciente</label>
          <textarea
            className="min-h-28 w-full rounded-md border px-3 py-2"
            defaultValue={anamnesis?.expectations ?? ''}
            name="expectations"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Fitzpatrick</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            defaultValue={anamnesis?.fitzpatrickSkinType ?? ''}
            name="fitzpatrickSkinType"
            placeholder="I, II, III, IV, V, VI"
          />
        </div>

        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white" type="submit">
          Salvar anamnese
        </button>
      </form>
    </section>
  );
}
