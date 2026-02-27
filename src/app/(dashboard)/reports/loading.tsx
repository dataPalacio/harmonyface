import { ReportsPageSkeleton } from '@/components/ui/skeleton-page';

/**
 * Loading state para a página de Relatórios/Dashboard.
 * Exibido automaticamente pelo Next.js enquanto os dados são carregados.
 */
export default function ReportsLoading() {
  return <ReportsPageSkeleton />;
}
