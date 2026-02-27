-- Phase 3: Financial & Inventory Module Migration
-- Handles financial records, payments, inventory, movements, and alerts

-- ============ FINANCIAL MODULE ============

-- Create financial_records table
CREATE TABLE IF NOT EXISTS public.financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  record_type text NOT NULL CHECK (record_type IN ('estimate', 'invoice', 'receipt', 'payment')),
  estimate_number text,
  invoice_number text,
  receipt_number text,
  description text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  tax_amount numeric(10,2),
  discount_amount numeric(10,2),
  net_amount numeric(10,2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled')),
  payment_method text CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'transfer', 'pix', 'check')),
  payment_date timestamp with time zone,
  due_date timestamp with time zone,
  notes text,
  document_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_record_id uuid NOT NULL REFERENCES public.financial_records(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'transfer', 'pix', 'check')),
  payment_date timestamp with time zone NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for financial records
CREATE INDEX IF NOT EXISTS idx_financial_records_patient_id ON public.financial_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_created_at ON public.financial_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_records_payment_status ON public.financial_records(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_financial_record_id ON public.payments(financial_record_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient_id ON public.payments(patient_id);

-- Enable RLS for financial_records
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "financial_records_select" ON public.financial_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "financial_records_insert" ON public.financial_records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "financial_records_update" ON public.financial_records
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "financial_records_delete" ON public.financial_records
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select" ON public.payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "payments_update" ON public.payments
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "payments_delete" ON public.payments
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============ INVENTORY MODULE ============

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  category text NOT NULL,
  supplier text,
  sku text UNIQUE,
  unit text NOT NULL CHECK (unit IN ('ml', 'g', 'mg', 'unit', 'box', 'syringe')),
  quantity integer NOT NULL DEFAULT 0,
  min_stock_level integer NOT NULL DEFAULT 5,
  max_stock_level integer NOT NULL DEFAULT 50,
  unit_cost numeric(10,2) NOT NULL,
  selling_price numeric(10,2),
  expiry_date date,
  batch_number text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create inventory_movements table
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement_type text NOT NULL CHECK (movement_type IN ('purchase', 'adjustment', 'deduction', 'return', 'waste')),
  quantity integer NOT NULL,
  quantity_before integer NOT NULL,
  quantity_after integer NOT NULL,
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  notes text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create inventory_alerts table
CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'expiry_warning', 'expired', 'overstocked')),
  message text NOT NULL,
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for inventory
CREATE INDEX IF NOT EXISTS idx_inventory_items_product_name ON public.inventory_items(product_name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_is_active ON public.inventory_items(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_items_expiry_date ON public.inventory_items(expiry_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_inventory_movements_inventory_item_id ON public.inventory_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_session_id ON public.inventory_movements(session_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON public.inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_inventory_item_id ON public.inventory_alerts(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_is_resolved ON public.inventory_alerts(is_resolved);

-- Enable RLS for inventory_items
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_items_select" ON public.inventory_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "inventory_items_insert" ON public.inventory_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_items_update" ON public.inventory_items
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_items_delete" ON public.inventory_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS for inventory_movements
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_movements_select" ON public.inventory_movements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "inventory_movements_insert" ON public.inventory_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_movements_update" ON public.inventory_movements
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_movements_delete" ON public.inventory_movements
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS for inventory_alerts
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_alerts_select" ON public.inventory_alerts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "inventory_alerts_insert" ON public.inventory_alerts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_alerts_update" ON public.inventory_alerts
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_alerts_delete" ON public.inventory_alerts
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============ FUNCTION TRIGGERS FOR UPDATES ============

-- Update updated_at on financial_records
CREATE OR REPLACE FUNCTION public.update_financial_records_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_financial_records_timestamp ON public.financial_records;
CREATE TRIGGER update_financial_records_timestamp
  BEFORE UPDATE ON public.financial_records
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_financial_records_timestamp();

-- Update updated_at on inventory_items
CREATE OR REPLACE FUNCTION public.update_inventory_items_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_inventory_items_timestamp ON public.inventory_items;
CREATE TRIGGER update_inventory_items_timestamp
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_inventory_items_timestamp();
