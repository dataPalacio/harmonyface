-- ============================================================
-- PHASE 4 - AI INFRASTRUCTURE MIGRATION
-- Knowledge Base + AI Processing Logs + pgvector Support
-- Created: 2026-02-27
-- ============================================================

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- TABLE: knowledge_base
-- Stores indexed clinical knowledge with vector embeddings
-- ============================================================

CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL, -- 'bula', 'protocolo', 'artigo', 'guideline'
  content TEXT NOT NULL,
  embedding vector(384), -- sentence-transformers/all-MiniLM-L6-v2 dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
  ON knowledge_base USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create text search index for content
CREATE INDEX IF NOT EXISTS knowledge_base_content_idx 
  ON knowledge_base USING gin(to_tsvector('portuguese', content));

-- Create index for source filtering
CREATE INDEX IF NOT EXISTS knowledge_base_source_idx 
  ON knowledge_base(source);

-- ============================================================
-- TABLE: ai_processing_logs
-- Audit trail for all AI operations
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  process_type TEXT NOT NULL CHECK (process_type IN ('ner', 'rag', 'summarization', 'compliance')),
  input_text TEXT,
  input_query TEXT,
  output JSONB,
  model TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 4),
  processing_time_ms INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for logs
CREATE INDEX IF NOT EXISTS ai_processing_logs_session_idx 
  ON ai_processing_logs(session_id);

CREATE INDEX IF NOT EXISTS ai_processing_logs_type_idx 
  ON ai_processing_logs(process_type);

CREATE INDEX IF NOT EXISTS ai_processing_logs_created_idx 
  ON ai_processing_logs(created_at DESC);

-- ============================================================
-- ALTER SESSIONS TABLE
-- Add AI-related columns to sessions
-- ============================================================

ALTER TABLE sessions 
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_structured_data JSONB,
  ADD COLUMN IF NOT EXISTS ai_quality_score INTEGER CHECK (ai_quality_score >= 0 AND ai_quality_score <= 100),
  ADD COLUMN IF NOT EXISTS ai_compliance_score INTEGER CHECK (ai_compliance_score >= 0 AND ai_compliance_score <= 100),
  ADD COLUMN IF NOT EXISTS ai_compliance_flags JSONB DEFAULT '[]';

-- Create index for AI quality filtering
CREATE INDEX IF NOT EXISTS sessions_ai_quality_idx 
  ON sessions(ai_quality_score) WHERE ai_quality_score IS NOT NULL;

-- Create index for compliance filtering
CREATE INDEX IF NOT EXISTS sessions_ai_compliance_idx 
  ON sessions(ai_compliance_score) WHERE ai_compliance_score IS NOT NULL;

-- ============================================================
-- FUNCTION: search_knowledge_base
-- Vector similarity search with relevance threshold
-- ============================================================

CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(384),
  match_threshold FLOAT DEFAULT 0.4,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  source TEXT,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.source,
    kb.content,
    1 - (kb.embedding <=> query_embedding) AS similarity,
    kb.metadata
  FROM knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================
-- FUNCTION: update_knowledge_base_timestamp
-- Automatically update updated_at on changes
-- ============================================================

CREATE OR REPLACE FUNCTION update_knowledge_base_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for knowledge_base updates
CREATE TRIGGER knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_base_timestamp();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Same auth pattern as other tables
-- ============================================================

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_logs ENABLE ROW LEVEL SECURITY;

-- Knowledge base: read access for authenticated users
CREATE POLICY knowledge_base_select_policy ON knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

-- Knowledge base: admin-only insert/update/delete
CREATE POLICY knowledge_base_insert_policy ON knowledge_base
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- In production, restrict to admin role

CREATE POLICY knowledge_base_update_policy ON knowledge_base
  FOR UPDATE
  TO authenticated
  USING (true) -- In production, restrict to admin role
  WITH CHECK (true);

CREATE POLICY knowledge_base_delete_policy ON knowledge_base
  FOR DELETE
  TO authenticated
  USING (true); -- In production, restrict to admin role

-- AI logs: users can only see their own session logs
CREATE POLICY ai_processing_logs_select_policy ON ai_processing_logs
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE user_id = auth.uid()
    )
  );

-- AI logs: auto-insert with session ownership check
CREATE POLICY ai_processing_logs_insert_policy ON ai_processing_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- SEED DATA: Sample Knowledge Documents
-- Initial clinical knowledge for RAG pipeline
-- ============================================================

INSERT INTO knowledge_base (title, source, content, metadata) VALUES
(
  'Toxina Botulínica - Cuidados Pós-Operatório',
  'protocolo',
  'Cuidados após aplicação de toxina botulínica tipo A:
  
1. Não massagear a região tratada por 24 horas
2. Evitar deitar-se ou abaixar a cabeça nas primeiras 4 horas
3. Não praticar exercícios físicos intensos por 24-48 horas
4. Evitar exposição solar intensa e saunas por 48 horas
5. Não consumir bebidas alcoólicas no dia da aplicação
6. Retorno recomendado: 14-21 dias para avaliação do resultado

Possíveis efeitos adversos temporários:
- Edema leve no local da aplicação (resolve em 2-3 dias)
- Pequenas equimoses (podem ser cobertas com maquiagem)
- Cefaleia leve (rara, tratável com analgésicos comuns)

Contraindicações absolutas:
- Gravidez e lactação
- Doenças neuromusculares (miastenia gravis)
- Alergia conhecida a componentes do produto
- Infecção ativa no local de aplicação',
  '{"category": "procedimentos", "keywords": ["toxina", "botox", "pos-operatorio"]}'
),
(
  'Preenchimento com Ácido Hialurônico - Protocolo',
  'protocolo',
  'Protocolo para aplicação de ácido hialurônico:

Antes do procedimento:
- Avaliar histórico de alergias e uso de anticoagulantes
- Fotografias padronizadas pré-procedimento
- Assinar termo de consentimento informado
- Marcar pontos anatômicos de referência

Durante o procedimento:
- Assepsia rigorosa da pele
- Anestesia tópica quando indicada
- Técnica de injeção: linear, leque ou bolus conforme região
- Massagem modeladora ao final

Intervalos recomendados:
- Entre sessões: mínimo 14 dias
- Retoques: 30-45 dias após aplicação inicial
- Nova aplicação completa: 6-12 meses (depende do produto)

Complicações possíveis:
- Edema: normal até 72h, pode durar até 1 semana
- Equimoses: resolvem em 7-10 dias
- Nódulos: raro, exige avaliação e possível tratamento com hialuronidase
- Efeito Tyndall: evitar aplicação muito superficial',
  '{"category": "procedimentos", "keywords": ["preenchimento", "acido hialuronico", "protocolo"]}'
),
(
  'Radiesse - Características e Aplicação',
  'bula',
  'Radiesse (Hidroxilapatita de Cálcio):

Composição:
- Microesferas de hidroxilapatita de cálcio (30%)
- Gel carreador aquoso (70%)

Indicações aprovadas:
- Preenchimento de sulcos e rugas faciais moderadas a severas
- Aumento de volume em regiões específicas
- Estimulação de colágeno

Duração do resultado:
- 12-18 meses em média
- Efeito imediato + bioestimulação progressiva

Técnica de aplicação:
- Injeção em plano profundo (supraperiosteal ou subcutâneo profundo)
- Não aplicar em lábios ou região periocular
- Volume: 0,3-0,5ml por ponto de injeção

Armazenamento:
- Temperatura ambiente (15-30°C)
- Não congelar
- Validade: verificar no rótulo

Contraindicações:
- Hipersensibilidade a qualquer componente
- Infecções ativas ou inflamações cutâneas
- Tendência a queloides
- Gravidez e lactação (não estudado)',
  '{"category": "produtos", "keywords": ["radiesse", "hidroxilapatita", "bioestimulador"]}'
);

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

COMMENT ON TABLE knowledge_base IS 'Clinical knowledge repository with vector embeddings for RAG pipeline';
COMMENT ON TABLE ai_processing_logs IS 'Audit trail for all AI operations (NER, RAG, summarization, compliance)';
COMMENT ON FUNCTION search_knowledge_base IS 'Performs cosine similarity search on knowledge base embeddings';
