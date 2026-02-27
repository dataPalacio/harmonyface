'use client';

/**
 * Financial Form Component
 * Handles creation and updates of financial records with PDF generation
 */

import { useState } from 'react';
import type { FinancialRecord, FinancialRecordInput, FinancialRecordType, PaymentStatus } from '@/types/financial';

interface FinancialFormProps {
  patientId: string;
  onSuccess?: (record: FinancialRecord) => void;
  onError?: (error: string) => void;
}

export function FinancialForm({ patientId, onSuccess, onError }: FinancialFormProps) {
  const [formData, setFormData] = useState<Partial<FinancialRecordInput>>({
    patientId,
    recordType: 'invoice',
    paymentStatus: 'pending',
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev: Partial<FinancialRecordInput>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/financial?patientId=' + patientId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar registro financeiro');
      }

      const result = await response.json();
      onSuccess?.(result.data);
      setShowForm(false);
      setFormData({
        patientId,
        recordType: 'invoice',
        paymentStatus: 'pending',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const recordTypes: FinancialRecordType[] = ['estimate', 'invoice', 'receipt', 'payment'];
  const paymentStatuses: PaymentStatus[] = ['pending', 'partial', 'paid', 'overdue', 'cancelled'];

  const recordTypeLabels: Record<FinancialRecordType, string> = {
    estimate: 'Orçamento',
    invoice: 'Fatura',
    receipt: 'Recibo',
    payment: 'Pagamento',
  };

  const statusLabels: Record<PaymentStatus, string> = {
    pending: 'Pendente',
    partial: 'Parcial',
    paid: 'Pago',
    overdue: 'Atrasado',
    cancelled: 'Cancelado',
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Novo Registro Financeiro
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold">Novo Registro Financeiro</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tipo</label>
              <select
                value={formData.recordType || 'invoice'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('recordType', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {recordTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                value={formData.paymentStatus || 'pending'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('description', e.target.value)}
              placeholder="Ex: Consultoria de harmonização facial"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Total (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.totalAmount || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('totalAmount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Impostos (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.taxAmount || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('taxAmount', parseFloat(e.target.value) || undefined)}
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Desconto (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discountAmount || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('discountAmount', parseFloat(e.target.value) || undefined)}
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Data de Vencimento</label>
              <input
                type="date"
                value={formData.dueDate?.split('T')[0] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Data de Pagamento</label>
              <input
                type="date"
                value={formData.paymentDate?.split('T')[0] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('paymentDate', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Notas</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('notes', e.target.value)}
              placeholder="Notas adicionais..."
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
