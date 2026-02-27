/**
 * Inventory Management Page
 * Displays inventory items, alerts, and stock management interface
 */

import { createServerSupabaseClient } from '@/lib/auth-client';
import { InventoryForm } from '@/components/inventory/inventory-form';
import { InventoryList } from '@/components/inventory/inventory-list';
import type { AlertType, InventoryUnit } from '@/types/inventory';

interface InventoryItemRow {
  id: string;
  product_name: string;
  category: string;
  supplier: string | null;
  sku: string | null;
  unit: string;
  quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit_cost: number;
  selling_price: number | null;
  expiry_date: string | null;
  batch_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface InventoryAlertRow {
  id: string;
  inventory_item_id: string;
  alert_type: string;
  message: string;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

function toInventoryUnit(value: string): InventoryUnit {
  if (
    value === 'ml' ||
    value === 'g' ||
    value === 'mg' ||
    value === 'unit' ||
    value === 'box' ||
    value === 'syringe'
  ) {
    return value;
  }

  return 'unit';
}

function toAlertType(value: string): AlertType {
  if (
    value === 'low_stock' ||
    value === 'expiry_warning' ||
    value === 'expired' ||
    value === 'overstocked'
  ) {
    return value;
  }

  return 'low_stock';
}

export default async function InventoryPage() {
  const supabase = await createServerSupabaseClient();

  try {
    // Queries paralelas para máxima performance
    const [{ data: items, error: itemsError }, { data: alerts, error: alertsError }] = await Promise.all([
      supabase
        .from('inventory_items')
        .select('*')
        .eq('is_active', true)
        .order('product_name', { ascending: true }),
      supabase
        .from('inventory_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false }),
    ]);

    if (itemsError) throw itemsError;
    if (alertsError) throw alertsError;

    const typedItems = (items ?? []) as InventoryItemRow[];
    const typedAlerts = (alerts ?? []) as InventoryAlertRow[];

    const normalizedItems = typedItems.map((item) => ({
      id: item.id,
      productName: item.product_name,
      category: item.category,
      supplier: item.supplier ?? undefined,
      sku: item.sku ?? undefined,
      unit: toInventoryUnit(item.unit),
      quantity: item.quantity,
      minStockLevel: item.min_stock_level,
      maxStockLevel: item.max_stock_level,
      unitCost: item.unit_cost,
      sellingPrice: item.selling_price ?? undefined,
      expiryDate: item.expiry_date ?? undefined,
      batchNumber: item.batch_number ?? undefined,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    const normalizedAlerts = typedAlerts.map((alert) => ({
      id: alert.id,
      inventoryItemId: alert.inventory_item_id,
      alertType: toAlertType(alert.alert_type),
      message: alert.message,
      isResolved: alert.is_resolved,
      resolvedAt: alert.resolved_at ?? undefined,
      createdAt: alert.created_at,
    }));

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const lowStockItems = normalizedItems.filter(
      (i) => i.quantity <= i.minStockLevel
    );
    const expiringItems = normalizedItems.filter(
      (i) =>
        i.expiryDate &&
        new Date(i.expiryDate) >= now &&
        new Date(i.expiryDate) <= thirtyDaysFromNow
    );
    const expiredItems = normalizedItems.filter(
      (i) => i.expiryDate && new Date(i.expiryDate) < now
    );
    const overStockedItems = normalizedItems.filter(
      (i) => i.quantity >= i.maxStockLevel
    );

    const dashboard = {
      lowStockItems,
      expiredItems,
      expiringItems,
      overStockedItems,
      activeAlerts: normalizedAlerts,
      totalAlerts: normalizedAlerts.length,
      totalItems: normalizedItems.length,
      lastMovementDate: new Date().toISOString(),
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
        </div>

        <InventoryForm />
        <InventoryList
          items={normalizedItems}
          dashboard={dashboard}
          onDelete={async (id: string) => {
            'use server';
            await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
          }}
        />
      </div>
    );
  } catch {
    return <div className="text-red-600">Erro ao carregar dados de estoque</div>;
  }
}
