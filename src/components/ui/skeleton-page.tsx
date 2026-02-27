/**
 * Skeleton loaders reutilizáveis para estados de carregamento de página.
 * Exibe placeholders animados enquanto o conteúdo server-side carrega.
 */

/** Skeleton genérico de linha */
function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Skeleton de card KPI (4 colunas) */
export function KPISkeletonRow() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-6 space-y-3">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-8 w-16" />
          <SkeletonLine className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton de tabela / lista */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b p-4">
        <SkeletonLine className="h-5 w-40" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <SkeletonLine className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-4 w-48" />
              <SkeletonLine className="h-3 w-32" />
            </div>
            <SkeletonLine className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton de gráfico */
export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`rounded-lg border bg-white p-6 ${height}`}>
      <SkeletonLine className="h-5 w-32 mb-4" />
      <div className="flex items-end gap-2 h-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonLine
            key={i}
            className={`flex-1 rounded-t-sm ${
              ['h-12', 'h-20', 'h-32', 'h-16', 'h-28', 'h-10', 'h-36', 'h-24', 'h-18', 'h-30', 'h-14', 'h-22'][i]
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Skeleton padrão para a página de Relatórios/Dashboard */
export function ReportsPageSkeleton() {
  return (
    <div className="space-y-6" aria-label="Carregando dashboard..." role="status">
      <div className="space-y-1">
        <SkeletonLine className="h-8 w-40" />
        <SkeletonLine className="h-4 w-64" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-9 w-72 rounded-md" />
      </div>
      <KPISkeletonRow />
      <KPISkeletonRow />
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton rows={4} />
    </div>
  );
}

/** Skeleton padrão para página de Pacientes */
export function PatientsPageSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando pacientes..." role="status">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-8 w-32" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <SkeletonLine className="h-6 w-36" />
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLine key={i} className="h-10 w-full rounded-md" />
          ))}
          <SkeletonLine className="h-10 w-28 rounded-md" />
        </div>
        <TableSkeleton rows={6} />
      </div>
    </div>
  );
}

/** Skeleton padrão para página de Agenda */
export function AppointmentsPageSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando agenda..." role="status">
      <SkeletonLine className="h-8 w-24" />
      <div className="rounded-lg border bg-white p-4 space-y-3">
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonLine key={i} className="h-8 w-10 rounded-md" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <SkeletonLine className="h-10 w-14 flex-shrink-0" />
            <SkeletonLine className={`h-10 flex-1 ${i % 3 === 0 ? 'bg-blue-100' : ''} rounded-md`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton genérico para páginas simples */
export function GenericPageSkeleton({ title = '' }: { title?: string }) {
  return (
    <div className="space-y-6" aria-label="Carregando..." role="status">
      <div className="flex justify-between items-center">
        <SkeletonLine className="h-8 w-48" />
        <SkeletonLine className="h-9 w-28 rounded-md" />
      </div>
      {title === '' && <SkeletonLine className="h-4 w-64" />}
      <div className="rounded-lg border bg-white p-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLine key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}
