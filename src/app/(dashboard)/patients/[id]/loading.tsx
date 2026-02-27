import { TableSkeleton, KPISkeletonRow } from '@/components/ui/skeleton-page';

/**
 * Loading state para a página de detalhe do Paciente.
 * Exibido automaticamente pelo Next.js enquanto os dados são carregados.
 */
export default function PatientDetailLoading() {
  return (
    <div className="space-y-6" aria-label="Carregando paciente..." role="status">
      <div className="animate-pulse space-y-1">
        <div className="h-8 w-48 rounded-md bg-slate-200" />
        <div className="h-4 w-32 rounded-md bg-slate-200" />
      </div>
      <KPISkeletonRow />
      <TableSkeleton rows={4} />
    </div>
  );
}
