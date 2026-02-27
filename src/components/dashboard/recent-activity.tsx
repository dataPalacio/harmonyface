/**
 * Recent Activity Component
 * Shows recent sessions and upcoming appointments
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, User } from 'lucide-react';
import type { SessionSummary, AppointmentSummary } from '@/types/analytics';
import Link from 'next/link';

interface RecentActivityProps {
  sessions?: SessionSummary[];
  appointments?: AppointmentSummary[];
}

export function RecentActivity({ sessions = [], appointments = [] }: RecentActivityProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessões Recentes</CardTitle>
          <CardDescription>Últimos atendimentos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma sessão recente</p>
            ) : (
              sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{session.patientName}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {session.procedures.map((proc, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {proc}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(session.revenue)}
                      </span>
                      {session.complianceScore !== undefined && (
                        <span className={`font-medium ${session.complianceScore >= 80 ? 'text-green-600' : session.complianceScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          Compliance: {session.complianceScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
          <CardDescription>Consultas marcadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum agendamento próximo</p>
            ) : (
              appointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments`}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{appointment.patientName}</p>
                      <Badge variant={getStatusVariant(appointment.status)}>{getStatusLabel(appointment.status)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{appointment.procedureName}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(appointment.scheduledAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(appointment.scheduledAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>{appointment.durationMin}min</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'confirmed':
      return 'default';
    case 'scheduled':
      return 'secondary';
    case 'cancelled':
    case 'no_show':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    in_progress: 'Em Atendimento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    no_show: 'Falta',
  };
  return labels[status] || status;
}
