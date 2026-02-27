import { PatientsPageSkeleton } from '@/components/ui/skeleton-page';

/**
 * Loading state para a página de Pacientes.
 * Exibido automaticamente pelo Next.js enquanto os dados são carregados.
 */
export default function PatientsLoading() {
  return <PatientsPageSkeleton />;
}
