import { AppointmentsPageSkeleton } from '@/components/ui/skeleton-page';

/**
 * Loading state para a página de Agenda.
 * Exibido automaticamente pelo Next.js enquanto os dados são carregados.
 */
export default function AppointmentsLoading() {
  return <AppointmentsPageSkeleton />;
}
