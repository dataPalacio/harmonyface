import { notFound } from 'next/navigation';
import { getPatientById } from '@/lib/services/patients-service';
import { getLatestConsent } from '@/lib/services/consent-service';
import { ConsentForm } from '@/components/patients/consent-form';

export default async function ConsentPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  const consent = await getLatestConsent(params.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Termo digital — {patient.fullName}</h1>
      <ConsentForm initialConsent={consent} patientId={params.id} />
    </section>
  );
}
