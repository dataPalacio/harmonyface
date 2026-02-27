import { listAppointments } from '@/lib/services/appointments-service';
import { listPatients } from '@/lib/services/patients-service';
import { listActiveProcedures } from '@/lib/services/procedure-catalog-service';
import dynamic from 'next/dynamic';

const AppointmentsCalendar = dynamic(
  () => import('@/components/appointments/appointments-calendar').then(mod => mod.AppointmentsCalendar),
  {
    ssr: false,
    loading: () => <div className="h-[600px] w-full animate-pulse rounded-xl bg-slate-100" />
  }
);

export default async function AppointmentsPage() {
  const [appointments, patients, procedures] = await Promise.all([
    listAppointments(),
    listPatients(),
    listActiveProcedures()
  ]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Agenda</h1>
      <AppointmentsCalendar initialAppointments={appointments} patients={patients} procedures={procedures} />
    </section>
  );
}
