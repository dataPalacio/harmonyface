'use client';

/**
 * Inventory Form Component
 * Handles creation and updates of inventory items
 */

import { useState } from 'react';
import type { InventoryItem, InventoryItemInput, InventoryUnit } from '@/types/inventory';

interface InventoryFormProps {
  onSuccess?: (item: InventoryItem) => void;
  onError?: (error: string) => void;
}

export function InventoryForm({ onSuccess, onError }: InventoryFormProps) {
  const [formData, setFormData] = useState<Partial<InventoryItemInput>>({
    quantity: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev: Partial<InventoryItemInput>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar item de estoque');
      }

      const result = await response.json();
      onSuccess?.(result.data);
      setShowForm(false);
      setFormData({
        quantity: 0,
        isActive: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const units: InventoryUnit[] = ['ml', 'g', 'mg', 'unit', 'box', 'syringe'];

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Novo Produto
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold">Novo Produto</h3>

          <div>
            <label className="block text-sm font-medium">Nome do Produto *</label>
            <input
              type="text"
              value={formData.productName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('productName', e.target.value)}
              placeholder="Ex: Ácido Hialurônico"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Categoria *</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('category', e.target.value)}
                placeholder="Ex: Preenchedores"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Fornecedor</label>
              <input
                type="text"
                value={formData.supplier || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('supplier', e.target.value)}
                placeholder="Ex: Laboratório XYZ"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Unidade *</label>
              <select
                value={formData.unit || 'ml'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('unit', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Quantidade Inicial</label>
              <input
                type="number"
                step="1"
                value={formData.quantity || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('quantity', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sku', e.target.value)}
                placeholder="Ex: HA-500ML-001"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Estoque Mínimo *</label>
              <input
                type="number"
                step="1"
                value={formData.minStockLevel || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('minStockLevel', parseInt(e.target.value))}
                placeholder="Ex: 5"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Estoque Máximo *</label>
              <input
                type="number"
                step="1"
                value={formData.maxStockLevel || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('maxStockLevel', parseInt(e.target.value))}
                placeholder="Ex: 50"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Custo Unitário (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unitCost', parseFloat(e.target.value))}
                placeholder="Ex: 125.50"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Preço de Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingPrice || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sellingPrice', parseFloat(e.target.value) || undefined)}
                placeholder="Ex: 200.00"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Data de Vencimento</label>
              <input
                type="date"
                value={formData.expiryDate?.split('T')[0] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Lote/Batch</label>
              <input
                type="text"
                value={formData.batchNumber || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('batchNumber', e.target.value)}
                placeholder="Ex: Lote-2026-001"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
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
