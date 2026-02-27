'use client';

import { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { Appointment } from '@/types/appointment';
import type { Patient } from '@/types/patient';
import type { ProcedureCatalogItem } from '@/types/procedure-catalog';

type Props = {
  initialAppointments: Appointment[];
  patients: Patient[];
  procedures: ProcedureCatalogItem[];
};

function labelForAppointment(item: Appointment) {
  if (item.status === 'blocked') {
    return `Bloqueado${item.roomName ? ` (${item.roomName})` : ''}`;
  }

  const patient = item.patientName || 'Paciente';
  const procedure = item.procedureName || item.appointmentType || 'Atendimento';
  return `${patient} • ${procedure}`;
}

export function AppointmentsCalendar({ initialAppointments, patients, procedures }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [loading, setLoading] = useState(false);

  const events = useMemo(
    () =>
      appointments.map((item: Appointment) => ({

        id: item.id,
        title: labelForAppointment(item),
        start: item.scheduledAt,
        end: new Date(new Date(item.scheduledAt).getTime() + (item.durationMin ?? 30) * 60_000).toISOString(),
        color: item.status === 'blocked' ? '#64748b' : undefined
      })),
    [appointments]
  );

  async function refreshAppointments() {
    const response = await fetch('/api/appointments', { cache: 'no-store' });
    const json = (await response.json()) as { data: Appointment[] };
    setAppointments(json.data ?? []);
  }

  async function onSubmit(formData: FormData) {
    setLoading(true);

    try {
      const payload = {
        patientId: String(formData.get('patientId') ?? '') || undefined,
        procedureId: String(formData.get('procedureId') ?? '') || undefined,
        appointmentType: String(formData.get('appointmentType') ?? '') || undefined,
        roomName: String(formData.get('roomName') ?? '') || undefined,
        scheduledAt: String(formData.get('scheduledAt') ?? ''),
        durationMin: Number(formData.get('durationMin') ?? 30),
        status: String(formData.get('status') ?? 'scheduled'),
        notes: String(formData.get('notes') ?? '') || undefined,
        isBlocked: String(formData.get('isBlocked') ?? 'false') === 'true'
      };

      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      await refreshAppointments();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <form
        action={async (formData: FormData) => {
          await onSubmit(formData);
        }}
        className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-4"
      >
        <select className="rounded-md border px-3 py-2" name="patientId">
          <option value="">Paciente (opcional p/ bloqueio)</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.fullName}
            </option>
          ))}
        </select>

        <select className="rounded-md border px-3 py-2" name="procedureId">
          <option value="">Procedimento</option>
          {procedures.map((procedure) => (
            <option key={procedure.id} value={procedure.id}>
              {procedure.name}
            </option>
          ))}
        </select>

        <input className="rounded-md border px-3 py-2" name="appointmentType" placeholder="Tipo (ex: retorno)" />
        <input className="rounded-md border px-3 py-2" name="roomName" placeholder="Sala/Cadeira" />

        <input className="rounded-md border px-3 py-2" name="scheduledAt" required type="datetime-local" />
        <input className="rounded-md border px-3 py-2" defaultValue={30} min={10} name="durationMin" type="number" />

        <select className="rounded-md border px-3 py-2" defaultValue="scheduled" name="status">
          <option value="scheduled">Agendado</option>
          <option value="confirmed">Confirmado</option>
          <option value="in_progress">Em atendimento</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
          <option value="no_show">No-show</option>
          <option value="blocked">Bloqueio</option>
        </select>

        <select className="rounded-md border px-3 py-2" defaultValue="false" name="isBlocked">
          <option value="false">Agenda normal</option>
          <option value="true">Bloquear horário</option>
        </select>

        <textarea className="rounded-md border px-3 py-2 md:col-span-4" name="notes" placeholder="Observações do agendamento" />

        <div className="md:col-span-4">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70" disabled={loading} type="submit">
            {loading ? 'Salvando...' : 'Salvar agendamento'}
          </button>
        </div>
      </form>

      <div className="rounded-lg border bg-white p-4">
        <FullCalendar
          editable={false}
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="auto"
          initialView="timeGridWeek"
          locale="pt-br"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
      </div>
    </section>
  );
}
