'use client';

/**
 * Financial List Component
 * Displays financial records with summary and actions
 */

import { useState } from 'react';
import type { FinancialRecord, FinancialSummary } from '@/types/financial';

interface FinancialListProps {
  records: FinancialRecord[];
  summary: FinancialSummary;
  onRefresh?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function FinancialList({ records, summary, onRefresh, onDelete }: FinancialListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que quer deletar este registro?')) return;

    setDeleting(id);
    try {
      await onDelete?.(id);
      onRefresh?.();
    } finally {
      setDeleting(null);
    }
  };

  const recordTypeLabels: Record<string, string> = {
    estimate: 'Orçamento',
    invoice: 'Fatura',
    receipt: 'Recibo',
    payment: 'Pagamento',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    partial: 'Parcial',
    paid: 'Pago',
    overdue: 'Atrasado',
    cancelled: 'Cancelado',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Receita Total</p>
          <p className="text-2xl font-bold">R$ {summary.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pendente</p>
          <p className="text-2xl font-bold">R$ {summary.pendingPayments.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Atrasado</p>
          <p className="text-2xl font-bold">R$ {summary.overduePayments.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Taxa Conversão</p>
          <p className="text-2xl font-bold">{summary.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left text-sm font-semibold">Tipo</th>
              <th className="border p-2 text-left text-sm font-semibold">Descrição</th>
              <th className="border p-2 text-left text-sm font-semibold">Valor</th>
              <th className="border p-2 text-left text-sm font-semibold">Status</th>
              <th className="border p-2 text-left text-sm font-semibold">Vencimento</th>
              <th className="border p-2 text-left text-sm font-semibold">PDF</th>
              <th className="border p-2 text-center text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-4 text-center text-gray-500">
                  Nenhum registro financeiro
                </td>
              </tr>
            ) : (
              records.map((record: FinancialRecord) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-sm">{recordTypeLabels[record.recordType] || record.recordType}</td>
                  <td className="border p-2 text-sm">{record.description}</td>
                  <td className="border p-2 text-sm font-semibold">R$ {record.netAmount.toFixed(2)}</td>
                  <td className="border p-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[record.paymentStatus] || ''}`}>
                      {statusLabels[record.paymentStatus] || record.paymentStatus}
                    </span>
                  </td>
                  <td className="border p-2 text-sm">
                    {record.dueDate ? new Date(record.dueDate).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="border p-2 text-sm text-center">
                    {record.documentUrl ? (
                      <a
                        href={record.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        📄
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="border p-2 text-center text-sm">
                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={deleting === record.id}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deleting === record.id ? '...' : 'Deletar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
