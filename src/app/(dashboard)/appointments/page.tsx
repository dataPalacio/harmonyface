import { AppointmentsCalendar } from '@/components/appointments/appointments-calendar';
import { listAppointments } from '@/lib/services/appointments-service';
import { listPatients } from '@/lib/services/patients-service';
import { listActiveProcedures } from '@/lib/services/procedure-catalog-service';

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
