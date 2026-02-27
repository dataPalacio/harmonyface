-- =============================================
-- MIGRATION: Phase 5 - Notification Logs Table
-- Depends on: appointments, sessions, patients
-- =============================================

-- =============================================
-- NOTIFICATION LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    -- email, sms, whatsapp, push
    recipient VARCHAR(255) NOT NULL,
    -- email address, phone number, or user identifier
    subject VARCHAR(500),
    -- email subject or notification title
    body TEXT,
    -- notification body/message
    status VARCHAR(50) DEFAULT 'pending',
    -- pending, sent, failed, bounced, opened
    error_message TEXT,
    -- error details if status = failed
    sent_at TIMESTAMPTZ,
    -- actual send timestamp
    opened_at TIMESTAMPTZ,
    -- when recipient opened (for email tracking)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign keys (optional - can be null)
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    
    -- Metadata for future use (provider response, tracking tokens, etc)
    metadata JSONB
);

-- =============================================
-- INDEXES FOR NOTIFICATION LOGS
-- =============================================

-- Type index (common filter)
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(type);

-- Status index (for finding pending/failed)
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);

-- Sent date index (for reporting)
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON notification_logs(sent_at DESC);

-- Appointment tracking
CREATE INDEX IF NOT EXISTS idx_notification_logs_appointment_id ON notification_logs(appointment_id);

-- Patient tracking
CREATE INDEX IF NOT EXISTS idx_notification_logs_patient_id ON notification_logs(patient_id);

-- Session tracking
CREATE INDEX IF NOT EXISTS idx_notification_logs_session_id ON notification_logs(session_id);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_notification_logs_type_status ON notification_logs(type, status);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- SELECT: Authenticated users can read all notification logs
CREATE POLICY "authenticated_can_select_notification_logs" ON notification_logs
    FOR SELECT TO authenticated USING (true);

-- INSERT: Authenticated users can create notification logs
CREATE POLICY "authenticated_can_insert_notification_logs" ON notification_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- UPDATE: Not allowed (immutable audit trail)
-- DELETE: Not allowed (immutable audit trail)

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE notification_logs IS 'Audit trail de todas as notificações enviadas (email, SMS, WhatsApp, push)';
COMMENT ON COLUMN notification_logs.type IS 'Tipo de notificação: email, sms, whatsapp, push';
COMMENT ON COLUMN notification_logs.status IS 'Status do envio: pending, sent, failed, bounced, opened';
COMMENT ON COLUMN notification_logs.appointment_id IS 'Referência ao agendamento (opcional)';
COMMENT ON COLUMN notification_logs.session_id IS 'Referência à sessão (opcional)';
COMMENT ON COLUMN notification_logs.patient_id IS 'Referência ao paciente (opcional)';
COMMENT ON COLUMN notification_logs.metadata IS 'Dados adicionais: resposta do provider, tokens de rastreamento, etc';
