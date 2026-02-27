export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'blocked';

export type Appointment = {
  id: string;
  patientId?: string;
  procedureId?: string;
  appointmentType?: string;
  roomName?: string;
  scheduledAt: string;
  durationMin?: number;
  status: AppointmentStatus;
  reminderSent: boolean;
  notes?: string;
  patientName?: string;
  procedureName?: string;
};

export type AppointmentInput = {
  patientId?: string;
  procedureId?: string;
  appointmentType?: string;
  roomName?: string;
  scheduledAt: string;
  durationMin?: number;
  status?: AppointmentStatus;
  notes?: string;
  isBlocked?: boolean;
};
