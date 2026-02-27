-- =============================================
-- MIGRATION: Create Base Schema for HarmoniFace
-- Phase 1-3 Tables (Dependencies for Phase 5)
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- =============================================
-- PATIENTS
-- =============================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSONB,
    profile_photo_url TEXT,
    medical_history JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROCEDURE CATALOG
-- =============================================
CREATE TABLE IF NOT EXISTS procedure_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    default_duration_min INT,
    default_price DECIMAL(10,2),
    facial_regions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ANAMNESIS
-- =============================================
CREATE TABLE IF NOT EXISTS anamnesis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    allergies JSONB,
    current_medications JSONB,
    previous_procedures JSONB,
    medical_conditions JSONB,
    expectations TEXT,
    expectations_structured JSONB,
    fitzpatrick_skin_type VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- APPOINTMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES procedure_catalog(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_min INT,
    status VARCHAR(30) DEFAULT 'scheduled',
    reminder_sent BOOLEAN DEFAULT false,
    return_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SESSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    date TIMESTAMPTZ NOT NULL,
    clinical_notes_raw TEXT,
    clinical_notes_structured JSONB,
    clinical_summary TEXT,
    compliance_score INT DEFAULT 0,
    compliance_flags JSONB,
    consent_signed BOOLEAN DEFAULT false,
    consent_document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SESSION PROCEDURES
-- =============================================
CREATE TABLE IF NOT EXISTS session_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES procedure_catalog(id),
    facial_region VARCHAR(100),
    product_used VARCHAR(255),
    product_lot VARCHAR(100),
    product_expiry DATE,
    quantity VARCHAR(50),
    technique VARCHAR(255),
    complications TEXT,
    before_photo_url TEXT,
    after_photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INVENTORY
-- =============================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    lot_number VARCHAR(100),
    expiry_date DATE,
    quantity_available DECIMAL(10,2),
    unit VARCHAR(50),
    min_stock_alert DECIMAL(10,2),
    cost_per_unit DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INVENTORY MOVEMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    session_procedure_id UUID REFERENCES session_procedures(id),
    movement_type VARCHAR(10),
    quantity DECIMAL(10,2),
    reason TEXT,
    moved_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FINANCIAL RECORDS
-- =============================================
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    session_id UUID REFERENCES sessions(id),
    type VARCHAR(20),
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    installments INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOCUMENT TEMPLATES
-- =============================================
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    type VARCHAR(50),
    content_html TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG
-- =============================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- KNOWLEDGE BASE (for RAG)
-- =============================================
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500),
    source VARCHAR(255),
    content TEXT,
    embedding vector(384),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES (Base Schema)
-- =============================================

-- Patients
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON patients(cpf);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_appointment_id ON sessions(appointment_id);

-- Financial
CREATE INDEX IF NOT EXISTS idx_financial_patient_id ON financial_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_financial_status ON financial_records(status);
CREATE INDEX IF NOT EXISTS idx_financial_created_at ON financial_records(created_at DESC);

-- Inventory
CREATE INDEX IF NOT EXISTS idx_inventory_product_name ON inventory(product_name);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry_date ON inventory(expiry_date);

-- Knowledge Base
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- =============================================
-- RLS POLICIES (Enable for base tables)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesis ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to access all data (single user app)
-- For production, implement proper policies

DO $$
BEGIN
    -- Patients policies
    IF NOT EXISTS (
        SELECT FROM pg_matviews 
        WHERE schemaname = 'public' AND matviewname = 'patients_all_policy_check'
    ) THEN
        CREATE POLICY "authenticated_can_access_patients" ON patients
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE patients IS 'Cadastro de pacientes - dados pessoais e médicos';
COMMENT ON TABLE appointments IS 'Agendamentos de procedimentos - agenda do consultório';
COMMENT ON TABLE sessions IS 'Sessões/atendimentos realizados - prontuário eletrônico';
COMMENT ON TABLE financial_records IS 'Registros financeiros - faturamento e pagamentos';
COMMENT ON TABLE inventory IS 'Controle de estoque - insumos e produtos';
COMMENT ON TABLE knowledge_base IS 'Base de conhecimento para RAG (Retrieval-Augmented Generation)';
