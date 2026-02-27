# 🧬 MEGA PROMPT — Criação do CRM "HarmoniFace"

## Sistema de Gestão para Consultório de Harmonização Facial com IA

---

## 1. CONTEXTO DO PROJETO

Você é um engenheiro de software sênior full-stack especializado em sistemas de saúde,
com experiência em IA clínica e compliance regulatório (LGPD/HIPAA).

**Missão:** Criar um CRM web completo chamado **"HarmoniFace"** para gestão de consultórios
de harmonização facial. O sistema será utilizado por **uma única profissional** (dona do
consultório) e deve cobrir todo o ciclo operacional: desde o cadastro do paciente até o
faturamento, passando por prontuário eletrônico inteligente com IA.

**Inspiração arquitetural:** O projeto open-source [DentneD](https://github.com/davidegironi/dentned),
um software de gestão para consultórios odontológicos em C#/.NET com as seguintes características
relevantes que devem ser adaptadas:

- Cadastro de pacientes e histórico médico completo
- Gestão de tratamentos e procedimentos
- Agenda de consultas
- Faturamento com faturas e orçamentos
- Relatórios customizáveis
- Templates PDF para saída de documentos
- Gestão de anexos e notas do paciente

> **DIFERENCIAL:** Diferente do DentneD (desktop C#/Windows), o HarmoniFace será uma
> **aplicação web moderna**, responsiva, com **camada de IA integrada** para processamento
> de linguagem natural em anotações clínicas.

---

## 2. REQUISITOS MÍNIMOS — MVP (Minimum Viable Product)

### 2.1 Módulo de Pacientes (Prontuário Eletrônico)

- [ ] Cadastro completo: nome, CPF, data de nascimento, contato, endereço, foto de perfil
- [ ] Anamnese específica para harmonização facial:
  - Alergias (lidocaína, ácido hialurônico, toxina botulínica, etc.)
  - Histórico de procedimentos estéticos anteriores
  - Medicações em uso (anticoagulantes, isotretinoína, etc.)
  - Condições médicas relevantes (herpes labial recorrente, doenças autoimunes, diabetes)
  - Expectativas do paciente (campo de texto livre → processado por IA)
- [ ] Upload de fotos clínicas (antes/depois) com marcação de data e procedimento
- [ ] Galeria comparativa de evolução facial (timeline visual)
- [ ] Termo de consentimento digital com assinatura eletrônica
- [ ] Campo de anotações clínicas livres (texto → estruturado via NLP/NER)

### 2.2 Módulo de Tratamentos e Procedimentos

- [ ] Catálogo de procedimentos pré-cadastrados:
  - Toxina Botulínica (Botox) — por região: frontal, glabela, periocular, etc.
  - Preenchimento com Ácido Hialurônico — lábios, malar, mandíbula, mento, sulco nasogeniano
  - Bioestimuladores de colágeno (Sculptra, Radiesse)
  - Fios de PDO (sustentação, estimulação)
  - Skinbooster / Mesoterapia
  - Lipo de Papada enzimática
  - Peeling químico
  - Microagulhamento / Drug Delivery
- [ ] Registro de cada sessão: data, procedimento, região facial, produto utilizado, lote, quantidade, técnica aplicada, intercorrências
- [ ] Vinculação do tratamento ao prontuário do paciente
- [ ] Planejamento de protocolo (sequência de sessões futuras)
- [ ] Alertas de retorno e manutenção (ex.: Botox a cada 4-6 meses)

### 2.3 Módulo de Agendamento

- [ ] Calendário visual (dia/semana/mês)
- [ ] Agendamento com tipo de procedimento, duração estimada, sala/cadeira
- [ ] Status do agendamento: Agendado, Confirmado, Em Atendimento, Concluído, Cancelado, No-show
- [ ] Lembretes automáticos (WhatsApp API / Email / SMS)
- [ ] Bloqueio de horários (almoço, férias, feriados)
- [ ] Visualização de agenda com indicadores de ocupação

### 2.4 Módulo de Faturamento e Financeiro

- [ ] Geração de orçamentos personalizados por paciente/tratamento
- [ ] Emissão de recibos e faturas
- [ ] Controle de pagamentos (dinheiro, cartão, PIX, parcelamento)
- [ ] Relatório de faturamento por período, por procedimento, por paciente
- [ ] Controle de inadimplência
- [ ] Exportação PDF de documentos financeiros

### 2.5 Módulo de Estoque

- [ ] Cadastro de produtos/insumos: nome, fabricante, lote, validade, quantidade
- [ ] Baixa automática de estoque ao registrar procedimento
- [ ] Alertas de estoque mínimo
- [ ] Alertas de validade próxima
- [ ] Histórico de movimentação (entrada/saída)
- [ ] Relatório de consumo por período e por procedimento

### 2.6 Módulo de Relatórios e Dashboard

- [ ] Dashboard principal com KPIs:
  - Pacientes atendidos (dia/semana/mês)
  - Faturamento bruto e líquido
  - Procedimentos mais realizados
  - Taxa de retorno de pacientes
  - Taxa de no-show
  - Ocupação da agenda
- [ ] Relatórios customizáveis com filtros de data, paciente, procedimento
- [ ] Exportação em PDF e CSV
- [ ] Gráficos interativos (barras, pizza, linha temporal)

### 2.7 Módulo Administrativo

- [ ] Configurações do consultório (dados, logo, horários de funcionamento)
- [ ] Backup de dados
- [ ] Log de ações do sistema (auditoria)
- [ ] Gestão de templates (termos de consentimento, orçamentos, recibos)
- [ ] Configuração de notificações e lembretes

---

## 3. CAMADA DE INTELIGÊNCIA ARTIFICIAL

### 3.1 NLP/NER — Estruturação de Anotações Clínicas (Texto → Campos)

**Objetivo:** A profissional digita uma anotação clínica em texto livre, e a IA extrai
automaticamente entidades e estrutura os dados.

**Exemplo de entrada (texto livre):**

```
Paciente Maria, 34 anos, compareceu para aplicação de toxina botulínica na região
da glabela e frontal, 25 unidades de Botox Allergan lote AB1234. Sem intercorrências.
Retorno agendado em 15 dias para avaliação. Queixa de assimetria labial, sugerido
preenchimento com ácido hialurônico Juvederm Ultra no lábio superior na próxima sessão.
```

**Saída estruturada esperada (JSON):**

```json
{
  "paciente": "Maria",
  "idade": 34,
  "procedimentos_realizados": [
    {
      "tipo": "Toxina Botulínica",
      "regiao": ["Glabela", "Frontal"],
      "produto": "Botox Allergan",
      "lote": "AB1234",
      "quantidade": "25 unidades",
      "intercorrencias": "Nenhuma"
    }
  ],
  "retorno": "15 dias",
  "procedimentos_sugeridos": [
    {
      "tipo": "Preenchimento com Ácido Hialurônico",
      "produto": "Juvederm Ultra",
      "regiao": ["Lábio superior"],
      "motivo": "Assimetria labial"
    }
  ]
}
```

**Implementação técnica:**

- Modelo base: `spaCy` com modelo customizado treinado em corpus de harmonização facial
  OU `Hugging Face Transformers` (ex.: BioBERT / PubMedBERT fine-tuned)
- Pipeline: Texto → Tokenização → NER (entidades clínicas) → Classificação → JSON estruturado
- Entidades a reconhecer: PROCEDIMENTO, REGIÃO_FACIAL, PRODUTO, LOTE, QUANTIDADE, INTERCORRÊNCIA,
  RETORNO, QUEIXA, SUGESTÃO
- Treinamento: Criar dataset anotado com pelo menos 500 exemplos de anotações clínicas típicas
  de harmonização facial

### 3.2 RAG — Retrieval-Augmented Generation (Assistente Clínico)

**Objetivo:** Assistente inteligente que consulta uma base de conhecimento curada
para apoio à decisão clínica.

**Casos de uso:**

1. **Consulta de protocolos:** "Qual o protocolo padrão para preenchimento de malar
   com Sculptra?"
2. **Interações medicamentosas:** "Paciente usa anticoagulante, posso aplicar
   preenchimento labial?"
3. **Bulas e dosagens:** "Qual a dosagem máxima de Botox para região frontal?"
4. **Complicações:** "Como tratar vascular occlusion por ácido hialurônico?"

**Implementação técnica:**

- **Vector Store:** Supabase com extensão `pgvector` (free tier suporta)
- **Embedding Model:** `text-embedding-3-small` (OpenAI) OU `all-MiniLM-L6-v2` (gratuito,
  local via Sentence Transformers)
- **LLM para geração:** `GPT-4o-mini` (baixo custo) OU `Llama 3.1 8B` (local, gratuito)
- **Base de conhecimento a indexar:**
  - Bulas dos produtos (Botox, Juvederm, Sculptra, Radiesse, etc.)
  - Protocolos clínicos publicados em revistas de estética
  - Guidelines da SBCP (Sociedade Brasileira de Cirurgia Plástica)
  - Artigos científicos sobre complicações e manejo
  - Notas técnicas da ANVISA sobre injetáveis estéticos
- **Pipeline RAG:** Query → Embedding → Busca vetorial no pgvector → Top-K chunks
  → Prompt com contexto → Resposta do LLM com citação da fonte

### 3.3 Sumarização e Padronização de Prontuário (Qualidade + Compliance)

**Objetivo:** Garantir que todo prontuário siga um padrão mínimo de qualidade e
esteja em conformidade com as exigências regulatórias (CFM, CRO, ANVISA, LGPD).

**Funcionalidades:**

- **Auto-sumarização:** Ao final de cada atendimento, a IA gera um resumo padronizado
  da sessão com campos obrigatórios preenchidos
- **Verificação de completude:** Alerta se campos obrigatórios estão vazios
  (ex.: lote do produto, consentimento assinado, região tratada)
- **Score de qualidade do prontuário:** Nota de 0-100 baseada em completude,
  padronização e conformidade
- **Padronização terminológica:** Normaliza termos variados para vocabulário controlado
  (ex.: "botox" → "Toxina Botulínica Tipo A", "aha" → "Ácido Hialurônico")
- **Flags de compliance:** Alertas automáticos para:
  - Prontuário sem termo de consentimento
  - Procedimento sem registro de lote
  - Intervalo entre sessões abaixo do recomendado
  - Produto com validade expirada utilizado

**Implementação técnica:**

- Template de sumarização via LLM com `structured output` (JSON mode)
- Regras de negócio para compliance implementadas em código (não dependem de IA)
- Checklist automático pós-atendimento
- Armazenamento de score histórico por prontuário

---

## 4. MODELO DE DADOS (SCHEMA DO BANCO)

```sql
-- =============================================
-- SCHEMA: HarmoniFace CRM
-- Banco: PostgreSQL (Supabase)
-- =============================================

-- PACIENTES
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSONB,
    profile_photo_url TEXT,
    medical_history JSONB, -- alergias, condições, medicações
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANAMNESE
CREATE TABLE anamnesis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    allergies JSONB, -- [{substance, severity, notes}]
    current_medications JSONB,
    previous_procedures JSONB,
    medical_conditions JSONB,
    expectations TEXT,
    expectations_structured JSONB, -- preenchido por IA
    fitzpatrick_skin_type VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATÁLOGO DE PROCEDIMENTOS
CREATE TABLE procedure_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- Toxina, Preenchimento, Bioestimulador, etc.
    description TEXT,
    default_duration_min INT,
    default_price DECIMAL(10,2),
    facial_regions JSONB, -- regiões aplicáveis
    is_active BOOLEAN DEFAULT true
);

-- SESSÕES / ATENDIMENTOS
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    date TIMESTAMPTZ NOT NULL,
    clinical_notes_raw TEXT, -- texto livre digitado
    clinical_notes_structured JSONB, -- extraído por NLP/NER
    clinical_summary TEXT, -- gerado por IA
    compliance_score INT, -- 0-100
    compliance_flags JSONB,
    consent_signed BOOLEAN DEFAULT false,
    consent_document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROCEDIMENTOS REALIZADOS (por sessão)
CREATE TABLE session_procedures (
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
    notes TEXT
);

-- AGENDAMENTOS
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    procedure_id UUID REFERENCES procedure_catalog(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_min INT,
    status VARCHAR(30) DEFAULT 'scheduled',
    -- scheduled, confirmed, in_progress, completed, cancelled, no_show
    reminder_sent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUTOS / ESTOQUE
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    lot_number VARCHAR(100),
    expiry_date DATE,
    quantity_available DECIMAL(10,2),
    unit VARCHAR(50), -- unidades, ml, mg
    min_stock_alert DECIMAL(10,2),
    cost_per_unit DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOVIMENTAÇÃO DE ESTOQUE
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id),
    session_procedure_id UUID REFERENCES session_procedures(id),
    movement_type VARCHAR(10), -- 'in' ou 'out'
    quantity DECIMAL(10,2),
    reason TEXT,
    moved_at TIMESTAMPTZ DEFAULT NOW()
);

-- FINANCEIRO
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    session_id UUID REFERENCES sessions(id),
    type VARCHAR(20), -- 'invoice', 'receipt', 'estimate'
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    installments INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending',
    -- pending, paid, partial, overdue, cancelled
    due_date DATE,
    paid_at TIMESTAMPTZ,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCUMENTOS / TEMPLATES
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    type VARCHAR(50), -- consent, invoice, estimate, receipt, report
    content_html TEXT,
    is_active BOOLEAN DEFAULT true
);

-- LOG DE AUDITORIA
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- BASE DE CONHECIMENTO (RAG)
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500),
    source VARCHAR(255), -- bula, protocolo, artigo, guideline
    content TEXT,
    embedding VECTOR(384), -- pgvector, dimensão depende do modelo
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca vetorial
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## 5. ALTERNATIVAS DE TECNOLOGIAS — ANÁLISE COMPARATIVA

### OPÇÃO A — 🟢 Full Gratuita / Low-Cost (Recomendada para MVP Solo)

| Camada                    | Tecnologia                                              | Custo                |
| ------------------------- | ------------------------------------------------------- | -------------------- |
| **Frontend**        | Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui     | Gratuito             |
| **Backend/API**     | Next.js API Routes + Supabase Edge Functions            | Gratuito (free tier) |
| **Banco de dados**  | Supabase PostgreSQL (free tier: 500MB, 2 projetos)      | Gratuito             |
| **Autenticação**  | Supabase Auth (email/password)                          | Gratuito             |
| **Storage (fotos)** | Supabase Storage (1GB free tier)                        | Gratuito             |
| **Vetores/RAG**     | pgvector no Supabase                                    | Gratuito             |
| **NLP/NER**         | spaCy (local) ou Hugging Face Inference API (free tier) | Gratuito             |
| **LLM (RAG)**       | Llama 3.1 8B via Ollama (local) OU Groq API (free tier) | Gratuito             |
| **Embeddings**      | all-MiniLM-L6-v2 (Sentence Transformers, local)         | Gratuito             |
| **Deploy Frontend** | Vercel (free tier: 100GB bandwidth)                     | Gratuito             |
| **Deploy IA**       | Railway.app (free tier) ou local                        | Gratuito/~$5/mês    |
| **PDF**             | React-PDF ou Puppeteer                                  | Gratuito             |
| **Agenda**          | FullCalendar (open source)                              | Gratuito             |
| **Notificações**  | EmailJS (free tier) + WhatsApp Business API (limitado)  | Gratuito/baixo       |

**Complexidade:** ⭐⭐⭐ (Média)
**Estimativa de custo mensal:** R$ 0 a R$ 25 (se tudo no free tier)
**Estimativa de desenvolvimento:** 8-12 semanas (dev solo) / 4-6 semanas (time de 2)
**Viabilidade gratuita:** ✅ SIM — totalmente possível para uso de 1 profissional

---

### OPÇÃO B — 🟡 Custo Moderado / Mais Robusta

| Camada                   | Tecnologia                                                  | Custo        |
| ------------------------ | ----------------------------------------------------------- | ------------ |
| **Frontend**       | React + Vite + Material UI ou Ant Design                    | Gratuito     |
| **Backend**        | Node.js (Express/Fastify) + Prisma ORM                      | Gratuito     |
| **Banco de dados** | Supabase PostgreSQL (Pro: $25/mês se crescer) | $0-25/mês |              |
| **Autenticação** | Supabase Auth ou Auth.js                                    | Gratuito     |
| **Storage**        | Cloudflare R2 (10GB free)                                   | Gratuito     |
| **NLP/NER**        | OpenAI GPT-4o-mini (structured output)                      | ~$5-15/mês  |
| **RAG**            | LangChain + pgvector + OpenAI Embeddings                    | ~$5-10/mês  |
| **LLM**            | GPT-4o-mini                                                 | ~$10-20/mês |
| **Deploy**         | Railway ($5/mês) ou Render | $5-10/mês                    |              |
| **PDF**            | Playwright / html-pdf                                       | Gratuito     |
| **Notificações** | Resend (emails) + Twilio (SMS/WhatsApp)                     | ~$10-20/mês |

**Complexidade:** ⭐⭐⭐⭐ (Média-Alta)
**Estimativa de custo mensal:** R$ 100 a R$ 300
**Estimativa de desenvolvimento:** 10-16 semanas
**Viabilidade gratuita:** ⚠️ PARCIAL — base gratuita mas IA e notificações geram custos

---

### OPÇÃO C — 🔴 Enterprise / Máxima Robustez

| Camada                   | Tecnologia                                            | Custo        |
| ------------------------ | ----------------------------------------------------- | ------------ |
| **Frontend**       | Next.js + Tailwind + Radix UI                         | Gratuito     |
| **Backend**        | Python FastAPI + SQLAlchemy                           | Gratuito     |
| **Banco de dados** | Supabase Pro ou Neon PostgreSQL                       | $25-50/mês  |
| **IA completa**    | Azure AI Services (NER médico nativo) + Azure OpenAI | $50-200/mês |
| **RAG**            | LlamaIndex + Qdrant Cloud + Azure OpenAI              | $30-80/mês  |
| **Storage**        | Azure Blob Storage ou AWS S3                          | $5-15/mês   |
| **Deploy**         | Azure App Service ou AWS ECS                          | $30-100/mês |
| **Conformidade**   | LGPD/HIPAA-ready infra                                | Incluído    |

**Complexidade:** ⭐⭐⭐⭐⭐ (Alta)
**Estimativa de custo mensal:** R$ 500 a R$ 2.000+
**Estimativa de desenvolvimento:** 16-24 semanas
**Viabilidade gratuita:** ❌ NÃO

---

## 6. ARQUITETURA RECOMENDADA (OPÇÃO A — MVP GRATUITO)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                        │
│               Next.js 14 + Tailwind + shadcn/ui                 │
│         FullCalendar │ React-PDF │ Recharts (gráficos)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ API Routes / Server Actions
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Free Tier)                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │PostgreSQL│  │  Auth     │  │  Storage   │  │ Edge Functions│  │
│  │+pgvector │  │(email/pw)│  │(fotos)    │  │ (webhooks)    │  │
│  └──────────┘  └──────────┘  └───────────┘  └───────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAMADA DE IA (Local/Free)                     │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ NLP/NER Engine   │  │  RAG Pipeline     │  │ Sumarização   │  │
│  │ spaCy + custom   │  │  pgvector search  │  │ LLM + regras  │  │
│  │ model            │  │  + Llama3/Groq    │  │ de compliance │  │
│  └─────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                 │
│  Embeddings: all-MiniLM-L6-v2 (local)                          │
│  LLM: Llama 3.1 8B (Ollama local) OU Groq API (free tier)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. ESTRUTURA DE PASTAS DO PROJETO

```
harmoniface/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Rotas de autenticação
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Rotas protegidas
│   │   │   ├── patients/             # CRUD pacientes
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── anamnesis/
│   │   │   │   │   ├── sessions/
│   │   │   │   │   ├── photos/
│   │   │   │   │   └── financial/
│   │   │   │   └── page.tsx
│   │   │   ├── appointments/         # Agenda
│   │   │   ├── treatments/           # Catálogo de procedimentos
│   │   │   ├── inventory/            # Estoque
│   │   │   ├── financial/            # Faturamento
│   │   │   ├── reports/              # Relatórios e Dashboard
│   │   │   ├── settings/             # Configurações
│   │   │   └── ai-assistant/         # Assistente RAG
│   │   ├── api/                      # API Routes
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   ├── sessions/
│   │   │   ├── inventory/
│   │   │   ├── financial/
│   │   │   ├── ai/
│   │   │   │   ├── ner/              # Endpoint NLP/NER
│   │   │   │   ├── rag/              # Endpoint RAG
│   │   │   │   ├── summarize/        # Endpoint sumarização
│   │   │   │   └── compliance/       # Verificação compliance
│   │   │   └── reports/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── treatments/
│   │   ├── inventory/
│   │   ├── financial/
│   │   ├── reports/
│   │   └── ai/
│   ├── lib/
│   │   ├── supabase/                 # Client e server Supabase
│   │   ├── ai/
│   │   │   ├── ner-pipeline.ts       # Pipeline NLP/NER
│   │   │   ├── rag-pipeline.ts       # Pipeline RAG
│   │   │   ├── summarizer.ts         # Sumarização
│   │   │   ├── compliance-checker.ts # Regras de compliance
│   │   │   └── embeddings.ts         # Geração de embeddings
│   │   ├── pdf/                      # Geração de PDFs
│   │   ├── notifications/            # Serviço de notificações
│   │   └── utils/
│   ├── types/                        # TypeScript types
│   └── hooks/                        # Custom React hooks
├── supabase/
│   ├── migrations/                   # SQL migrations
│   ├── seed.sql                      # Dados iniciais (procedimentos, templates)
│   └── functions/                    # Edge Functions
├── ai-service/                       # Serviço Python para IA (se local)
│   ├── ner/
│   │   ├── model/                    # Modelo spaCy customizado
│   │   ├── training/                 # Scripts de treino
│   │   └── api.py                    # FastAPI endpoint
│   ├── rag/
│   │   ├── indexer.py                # Indexação da base de conhecimento
│   │   └── retriever.py             # Busca e geração
│   └── requirements.txt
├── docs/
│   ├── knowledge-base/               # PDFs de bulas, protocolos, guidelines
│   └── ner-training-data/            # Dataset anotado para treino NER
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 8. INSTRUÇÕES DE IMPLEMENTAÇÃO — FASES

### FASE 1 — Fundação (Semanas 1-3)

1. Setup do projeto Next.js + Supabase
2. Schema do banco (migrations)
3. Autenticação (login da profissional)
4. CRUD de Pacientes com anamnese
5. Catálogo de procedimentos (seed data)

### FASE 2 — Operacional (Semanas 4-6)

6. Módulo de Agendamento (FullCalendar)
7. Registro de sessões/atendimentos
8. Upload e galeria de fotos clínicas
9. Termo de consentimento digital

### FASE 3 — Financeiro e Estoque (Semanas 7-9)

10. Módulo de faturamento
11. Geração de PDFs (orçamentos, recibos)
12. Módulo de estoque com baixa automática
13. Alertas de validade e estoque mínimo

### FASE 4 — Inteligência Artificial (Semanas 10-12)

14. Pipeline NLP/NER para anotações clínicas
15. Pipeline RAG com base de conhecimento indexada
16. Sumarização automática de prontuário
17. Score de compliance e alertas

### FASE 5 — Refinamento (Semanas 13-14)

18. Dashboard com KPIs e gráficos
19. Relatórios exportáveis
20. Notificações (email/WhatsApp)
21. Testes, otimização e deploy final

---

## 9. REGRAS DE NEGÓCIO CRÍTICAS

1. **LGPD:** Todos os dados de pacientes devem ser criptografados em repouso.
   Consentimento explícito para armazenamento. Direito ao apagamento (soft-delete com
   período de retenção legal).
2. **Rastreabilidade:** Todo procedimento DEVE ter lote do produto registrado
   (exigência ANVISA).
3. **Prontuário:** Deve ser mantido por mínimo de 20 anos (CFM Resolução 1.821/07).
4. **Fotos:** Devem ter metadata de data, procedimento e consentimento do paciente
   para uso.
5. **Estoque:** Produtos vencidos devem ser automaticamente bloqueados para uso.
6. **IA:** Todas as sugestões da IA devem ter disclaimer: "Sugestão gerada por IA.
   A decisão clínica é de responsabilidade do profissional."

---

## 10. PROMPT DE EXECUÇÃO PARA O LLM DESENVOLVEDOR

> Ao receber este documento, implemente o projeto seguindo esta ordem:
>
> 1. Leia TODOS os requisitos antes de começar
> 2. Implemente fase por fase, nunca pule etapas
> 3. Cada módulo deve ter: model (types), service (lógica), component (UI), API route
> 4. Use TypeScript strict mode em todo o projeto
> 5. Siga o padrão de código: ESLint + Prettier
> 6. Documente cada função pública com JSDoc
> 7. Escreva testes unitários para services e funções de IA
> 8. Faça commits semânticos (feat:, fix:, docs:, refactor:)
> 9. Ao completar cada fase, gere um CHANGELOG.md atualizado
> 10. Em caso de dúvida sobre regra de negócio clínica, PERGUNTE antes de assumir
>
