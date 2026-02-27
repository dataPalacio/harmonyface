import { GenericPageSkeleton } from '@/components/ui/skeleton-page';

/**
 * Loading state para a página de Gestão Financeira.
 * Exibido automaticamente pelo Next.js enquanto os dados são carregados.
 */
export default function FinancialLoading() {
  return <GenericPageSkeleton />;
}
