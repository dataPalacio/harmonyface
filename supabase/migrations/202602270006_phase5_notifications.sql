-- ==========================================
-- FASE 5: Notification Logs Table
-- Tracks all notifications sent by the system
-- ==========================================

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- References
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_notification_logs_type ON notification_logs(type);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at DESC);
CREATE INDEX idx_notification_logs_appointment_id ON notification_logs(appointment_id);
CREATE INDEX idx_notification_logs_patient_id ON notification_logs(patient_id);

-- RLS Policies
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_logs_select_policy" ON notification_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "notification_logs_insert_policy" ON notification_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comments
COMMENT ON TABLE notification_logs IS 'Tracks all notifications sent by the system (email, SMS, etc.)';
COMMENT ON COLUMN notification_logs.type IS 'Type of notification: email, sms, whatsapp, push';
COMMENT ON COLUMN notification_logs.status IS 'Delivery status: pending, sent, failed, bounced';
COMMENT ON COLUMN notification_logs.metadata IS 'Additional data (provider response, click tracking, etc.)';
