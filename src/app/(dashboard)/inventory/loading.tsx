import { GenericPageSkeleton } from '@/components/ui/skeleton-page';

/**
 * Loading state para a página de Estoque.
 * Exibido automaticamente pelo Next.js enquanto os dados são carregados.
 */
export default function InventoryLoading() {
  return <GenericPageSkeleton />;
}
