'use client';

/**
 * Inventory List Component
 * Displays inventory items with low-stock alerts and expiry warnings
 */

import { useState } from 'react';
import type { InventoryItem, InventoryAlert, InventoryDashboard } from '@/types/inventory';

interface InventoryListProps {
  items: InventoryItem[];
  dashboard: InventoryDashboard;
  onRefresh?: () => void;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, quantity: number) => Promise<void>;
}

export function InventoryList({ items, dashboard, onRefresh, onDelete, onUpdate }: InventoryListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que quer deletar este item?')) return;

    setDeleting(id);
    try {
      await onDelete?.(id);
      onRefresh?.();
    } finally {
      setDeleting(null);
    }
  };

  const getAlertTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      low_stock: 'Estoque Baixo',
      expiry_warning: 'Vencimento Próximo',
      expired: 'Vencido',
      overstocked: 'Excesso de Estoque',
    };
    return labels[type] || type;
  };

  const getAlertColor = (type: string): string => {
    const colors: Record<string, string> = {
      low_stock: 'bg-yellow-100 text-yellow-800',
      expiry_warning: 'bg-orange-100 text-orange-800',
      expired: 'bg-red-100 text-red-800',
      overstocked: 'bg-blue-100 text-blue-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (item: InventoryItem): string => {
    if (item.quantity <= item.minStockLevel) return 'Baixo';
    if (item.quantity >= item.maxStockLevel) return 'Alto';
    return 'Normal';
  };

  const getStockColor = (item: InventoryItem): string => {
    if (item.quantity <= item.minStockLevel) return 'bg-red-100 text-red-800';
    if (item.quantity >= item.maxStockLevel) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const isExpired = (item: InventoryItem): boolean => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate) < new Date();
  };

  const isExpiringSoon = (item: InventoryItem): boolean => {
    if (!item.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(item.expiryDate);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry >= now && expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total de Itens</p>
          <p className="text-2xl font-bold">{dashboard.totalItems}</p>
        </div>
        <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Estoque Baixo</p>
          <p className="text-2xl font-bold">{dashboard.lowStockItems.length}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Vencendo</p>
          <p className="text-2xl font-bold">{dashboard.expiringItems.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Vencido</p>
          <p className="text-2xl font-bold">{dashboard.expiredItems.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Alertas Ativos</p>
          <p className="text-2xl font-bold">{dashboard.activeAlerts.length}</p>
        </div>
      </div>

      {/* Alerts Section */}
      {dashboard.activeAlerts.length > 0 && (
        <div className="border border-red-300 bg-red-50 p-4 rounded">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="w-full text-left font-semibold text-red-900 hover:text-red-700"
          >
            ⚠️ {dashboard.activeAlerts.length} Alertas Ativos {showAlerts ? '▼' : '▶'}
          </button>
          {showAlerts && (
            <div className="mt-3 space-y-2">
              {dashboard.activeAlerts.map((alert: InventoryAlert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded text-sm ${getAlertColor(alert.alertType)}`}
                >
                  <p className="font-semibold">{getAlertTypeLabel(alert.alertType)}</p>
                  <p>{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left text-sm font-semibold">Produto</th>
              <th className="border p-2 text-left text-sm font-semibold">Categoria</th>
              <th className="border p-2 text-center text-sm font-semibold">Estoque</th>
              <th className="border p-2 text-center text-sm font-semibold">Mín/Máx</th>
              <th className="border p-2 text-center text-sm font-semibold">Status</th>
              <th className="border p-2 text-center text-sm font-semibold">Custo Unit.</th>
              <th className="border p-2 text-center text-sm font-semibold">Vencimento</th>
              <th className="border p-2 text-center text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="border p-4 text-center text-gray-500">
                  Nenhum item no estoque
                </td>
              </tr>
            ) : (
              items.map((item: InventoryItem) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${isExpired(item) ? 'bg-red-50' : isExpiringSoon(item) ? 'bg-orange-50' : ''}`}
                >
                  <td className="border p-2 text-sm font-medium">{item.productName}</td>
                  <td className="border p-2 text-sm">{item.category}</td>
                  <td className="border p-2 text-center text-sm font-semibold">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="border p-2 text-center text-sm">
                    {item.minStockLevel} / {item.maxStockLevel}
                  </td>
                  <td className="border p-2 text-center text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(item)}`}>
                      {getStockStatus(item)}
                    </span>
                  </td>
                  <td className="border p-2 text-center text-sm">
                    R$ {item.unitCost.toFixed(2)}
                  </td>
                  <td className="border p-2 text-center text-sm">
                    {item.expiryDate ? (
                      <span className={isExpired(item) ? 'text-red-800 font-semibold' : 'text-gray-700'}>
                        {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="border p-2 text-center text-sm">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deleting === item.id ? '...' : 'Deletar'}
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
