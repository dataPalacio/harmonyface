/**
 * Inventory Module Types
 * Handles product inventory, movements, expiry tracking, and low-stock alerts
 */

export type InventoryUnit = 'ml' | 'g' | 'mg' | 'unit' | 'box' | 'syringe';
export type MovementType = 'purchase' | 'adjustment' | 'deduction' | 'return' | 'waste';
export type AlertType = 'low_stock' | 'expiry_warning' | 'expired' | 'overstocked';

export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  supplier?: string;
  sku?: string;
  unit: InventoryUnit;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  sellingPrice?: number;
  expiryDate?: string; // ISO 8601
  batchNumber?: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface InventoryItemInput {
  productName: string;
  category: string;
  supplier?: string;
  sku?: string;
  unit: InventoryUnit;
  quantity?: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  sellingPrice?: number;
  expiryDate?: string;
  batchNumber?: string;
  isActive?: boolean;
}

export interface InventoryMovement {
  id: string;
  inventoryItemId: string;
  movementType: MovementType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  sessionId?: string; // if deduction from session
  notes?: string;
  createdAt: string; // ISO 8601
  createdBy: string; // user ID
}

export interface InventoryMovementInput {
  inventoryItemId: string;
  movementType: MovementType;
  quantity: number;
  sessionId?: string;
  notes?: string;
}

export interface InventoryAlert {
  id: string;
  inventoryItemId: string;
  alertType: AlertType;
  message: string;
  isResolved: boolean;
  resolvedAt?: string; // ISO 8601
  createdAt: string; // ISO 8601
}

export interface InventoryDashboard {
  lowStockItems: InventoryItem[];
  expiredItems: InventoryItem[];
  expiringItems: InventoryItem[]; // within 30 days
  overStockedItems: InventoryItem[];
  activeAlerts: InventoryAlert[];
  totalAlerts: number;
  totalItems: number;
  lastMovementDate?: string;
}

export interface InventoryDeduction {
  inventoryItemId: string;
  quantity: number;
  notes?: string;
}
