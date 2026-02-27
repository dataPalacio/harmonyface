import { PatientsOverview } from '@/components/patients/patients-overview';
import { listPatients } from '@/lib/services/patients-service';

export default async function PatientsPage() {
  const patients = await listPatients();

  return <PatientsOverview patients={patients} />;
}
