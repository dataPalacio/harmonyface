/**
 * Inventory Management Page
 * Displays inventory items, alerts, and stock management interface
 */

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/auth-client';
import { InventoryForm } from '@/components/inventory/inventory-form';
import { InventoryList } from '@/components/inventory/inventory-list';

export default async function InventoryPage() {
  const supabase = await createServerSupabaseClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  try {
    // Fetch all inventory items
    const { data: items, error: itemsError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('is_active', true)
      .order('product_name', { ascending: true });

    if (itemsError) throw itemsError;

    // Fetch active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('inventory_alerts')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    if (alertsError) throw alertsError;

    const normalizedItems = (items || []).map((i: Record<string, unknown>) => ({
      id: i.id as string,
      productName: i.product_name as string,
      category: i.category as string,
      supplier: i.supplier as string | undefined,
      sku: i.sku as string | undefined,
      unit: i.unit as string,
      quantity: i.quantity as number,
      minStockLevel: i.min_stock_level as number,
      maxStockLevel: i.max_stock_level as number,
      unitCost: i.unit_cost as number,
      sellingPrice: i.selling_price as number | undefined,
      expiryDate: i.expiry_date as string | undefined,
      batchNumber: i.batch_number as string | undefined,
      isActive: i.is_active as boolean,
      createdAt: i.created_at as string,
      updatedAt: i.updated_at as string,
    }));

    const normalizedAlerts = (alerts || []).map((a: Record<string, unknown>) => ({
      id: a.id as string,
      inventoryItemId: a.inventory_item_id as string,
      alertType: a.alert_type as string,
      message: a.message as string,
      isResolved: a.is_resolved as boolean,
      resolvedAt: a.resolved_at as string | undefined,
      createdAt: a.created_at as string,
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
  } catch (error) {
    console.error('Inventory page error:', error);
    return <div className="text-red-600">Erro ao carregar dados de estoque</div>;
  }
}
