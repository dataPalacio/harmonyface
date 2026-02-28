
# 🧬 HarmoniFace — Plano de Melhorias: Página Pacientes

> Análise comparativa com Dental Office + Proposta de Evolução

---

## 📸 PARTE 1 — Análise do CRM de Referência (Dental Office)

### 🔍 Tecnologias e Padrões Observados

* **Layout de perfil em 3 colunas:** Dados pessoais (esquerda fixo) | Conteúdo central (scrollável) | Painel lateral de alertas (direita)
* **Sidebar colapsável** com ícones + labels, identidade visual roxa com gradiente
* **Sistema de abas** dentro do painel de alertas: Anamnese | Gerais | Retorno
* **Ações rápidas via ícones** na linha do paciente: ⚠️ (alertas) | 💰 (financeiro) | 💬 (WhatsApp) | 💬 (mensagem) | 🎥 (videochamada)
* **Status badge** visual: `Ativo` em verde no perfil
* **Busca global** por ctrl+K no topbar
* **Histórico de evolução** com tabela paginada e filtros avançados
* **Assistente de IA** contextual embutido no prontuário (botão "Assistente de IA" + CTA de contratação)
* **Documentos assinados** vinculados diretamente ao perfil do paciente
* **Próximos vencimentos financeiros** com tipo (Orçamento) e valor visível no perfil
* **Último tratamento** com lista de procedimentos e status (A realizar | Finalizado | Observado)

---

### 📋 Funcionalidades Identificadas no Dental Office

#### Seção: Dados Pessoais

* Foto de perfil com nome e número de registro
* Status badge (Ativo/Inativo) no perfil
* Ações rápidas por ícone: alertas, financeiro, WhatsApp, mensagem, videochamada
* Dados completos: Nascimento + idade calculada, CPF, RG
* Contato: celular, telefone residencial, e-mail
* Convênio vinculado (Particular / Plano)
* Campo "Outros": Profissional responsável + Clínica

#### Seção: Agendamentos (coluna central superior)

* Lista cronológica de todos os agendamentos do paciente
* Status por cores: ■ Confirmar (vermelho) | ■ Faltou (vermelho escuro)
* Ações por agendamento: editar ✏️ | excluir 🗑️ | notificar WhatsApp 💬
* Scroll independente da coluna

#### Seção: Evolução (coluna central inferior)

* Tabela com: Data | Profissional | Dente/Face | Procedimento | Descrição | Tratamento | Situação | Ações
* Filtros: Tratamento/Planejamento + Dentes + Filtros avançados
* Botão "Registrar evolução" com dropdown de ações
* Assistente de IA embutido na seção de evolução

#### Seção: Alertas (coluna direita)

* 3 abas: **Alertas de anamnese** | **Alertas gerais** | **Alertas de retorno**
* Cada alerta exibe: pergunta + resposta em negrito
* Link para ficha de anamnese completa com data

#### Seção: Próximos Vencimentos (segunda tela)

* Tabela: Vencimento | Tipo | Valor
* Expandível via ↗️

#### Seção: Último Tratamento (segunda tela)

* Cabeçalho: Data de abertura | Convênio | Situação ("Em Tratamento")
* Tabela de procedimentos: Data | Procedimento | Situação | Dente/Face | Profissional

#### Seção: Documentos Assinados

* Lista de documentos com link direto

---

### 🎯 Objetivos do CRM de Referência

* Centralizar **todas as informações do paciente** em uma única tela navegável
* Facilitar o **workflow clínico** durante o atendimento (o profissional não sai da tela)
* Fornecer **alertas clínicos proativos** para evitar erros (alergias, medicamentos, retornos)
* Integrar **financeiro + clínico** no mesmo perfil sem trocar de módulo
* Oferecer **comunicação direta** (WhatsApp/mensagem) sem sair do sistema

---

## 📱 PARTE 2 — Estado Atual do HarmoniFace (Página Pacientes)

### ✅ O que já existe

* KPIs no topo: Total de Pacientes | Novos este mês | Média de Idade
* Formulário de cadastro rápido na própria página
* Lista de pacientes com busca e ordenação A-Z / Z-A
* Botões de ação: `Prontuário` | `Excluir`
* Campos do formulário: Nome, CPF, Data de Nasc., Telefone, Email, Observações

### ❌ O que está faltando (gap analysis)

* Sem foto de perfil
* Sem status badge (Ativo/Inativo)
* Sem ações rápidas contextuais (WhatsApp, alertas)
* Sem visualização de alertas de anamnese na listagem
* Formulário de cadastro muito simplificado (sem endereço, RG, convênio)
* Sem indicadores visuais de pendências (retorno vencido, sem consentimento)
* Sem página de perfil detalhada com abas (histórico, financeiro, documentos)
* Botão "Excluir" faz delete físico (violação LGPD — deveria ser soft-delete)

---

## 🚀 PARTE 3 — Plano de Melhorias para a Página Pacientes

---

### 🟢 GRUPO A — Melhorias na Listagem de Pacientes (`/patients`)

#### A1. Card de Paciente Enriquecido na Lista

**O que adicionar:**

* Foto de perfil (avatar com iniciais como fallback)
* Badge de status: `Ativo` 🟢 | `Inativo` ⚪
* Badge de compliance score: 🟢 80+ | 🟡 50–79 | 🔴 <50
* Indicador de alertas clínicos: ⚠️ (se tem alergias críticas na anamnese)
* Data da última sessão + próximo retorno
* Indicador de retorno vencido (⏰ destacado em vermelho)
* Ações rápidas inline: WhatsApp 💬 | Ver Prontuário | Editar

**Skills:**

* 🎨 **Frontend Engineer** — Componente `PatientCard` com shadcn/ui, badges, avatar
* ⚙️ **Backend Engineer** — Query enriquecida em `PatientService.listAll()` com joins
* 🔒 **Security/LGPD Specialist** — Garantir soft-delete no botão "Excluir"

---

#### A2. Filtros Avançados na Listagem

**O que adicionar:**

* Abas: `Ativos` | `Inativos` (como no Dental Office)
* Filtro por: Procedimento mais recente | Faixa etária | Período de cadastro
* Filtro por compliance score (pacientes com prontuário incompleto)
* Filtro por alertas de retorno vencido
* Ordenação: Nome A-Z | Mais recente | Compliance score

**Skills:**

* 🎨 **Frontend Engineer** — Componente de filtros com shadcn/ui `Tabs` + `Select`
* ⚙️ **Backend Engineer** — Query params dinâmicos no endpoint `GET /api/patients`

---

#### A3. KPIs Expandidos no Topo

**Manter** os 3 existentes + adicionar:

* **Retornos vencidos** (pacientes que precisam voltar e não agendaram)
* **Pacientes sem consentimento** assinado
* **Compliance score médio** da base

**Skills:**

* ⚙️ **Backend Engineer** — Endpoint `/api/patients/stats` com agregações
* 🎨 **Frontend Engineer** — Novos cards de KPI com ícones Lucide

---

### 🟡 GRUPO B — Formulário de Cadastro Expandido

#### B1. Formulário Multi-Step de Cadastro

**Substituir o formulário simples atual por wizard com 3 etapas:**

**Etapa 1 — Dados Pessoais**

* Nome completo *
* CPF * (com validação de dígitos verificadores)
* Data de nascimento * (com cálculo automático de idade)
* Gênero
* RG
* Foto de perfil (upload)

**Etapa 2 — Contato e Convênio**

* Celular * (com máscara)
* Telefone residencial
* E-mail
* Endereço completo (CEP com auto-preenchimento)
* Tipo de atendimento: Particular | Convênio
* Nome do convênio (se aplicável)

**Etapa 3 — Informações Clínicas Iniciais**

* Observações gerais
* Profissional responsável
* Como conheceu o consultório (indicação, Instagram, etc.)
* Nº de registro interno (gerado automaticamente)

**Skills:**

* 🎨 **Frontend Engineer** — Wizard multi-step com `react-hook-form`, progress bar, shadcn/ui
* ⚙️ **Backend Engineer** — Schema Zod expandido + `PatientService.create()`
* 🗄️ **Database Architect** — Campos adicionais na tabela `patients` (RG, address JSONB, referral_source)
* 🔒 **Security/LGPD Specialist** — Validação CPF server-side, sanitização de inputs

---

### 🔵 GRUPO C — Página de Perfil do Paciente (`/patients/[id]`)

Esta é a maior lacuna atual. O HarmoniFace precisa de uma página completa de perfil, inspirada no layout 3 colunas do Dental Office,  **adaptada ao contexto de harmonização facial** .

---

#### C1. Layout de Perfil em 3 Colunas

**Coluna Esquerda — Dados do Paciente (fixo)**

* Foto de perfil + nome + nº de registro + status badge
* Ações rápidas: ⚠️ Alertas | 💰 Financeiro | 💬 WhatsApp | 📋 Prontuário
* Dados pessoais: Nascimento + idade, CPF (mascarado), RG, Gênero
* Contato: Celular, e-mail
* Tipo de atendimento / Convênio
* Profissional responsável

**Coluna Central — Conteúdo Principal (scrollável)**

* Próximos agendamentos com status e ações
* Histórico de sessões/evoluções com filtros
* Botão "Registrar nova sessão"

**Coluna Direita — Painel de Alertas Clínicos**

* 3 abas: `Alertas de Anamnese` | `Alertas Gerais` | `Alertas de Retorno`
* Próximos vencimentos financeiros
* Compliance score da última sessão

**Skills:**

* 🎨 **Frontend Engineer** — Layout 3 colunas responsivo, scroll independente por coluna
* ⚙️ **Backend Engineer** — Endpoint `/api/patients/[id]` com dados agregados
* 🔒 **Security/LGPD Specialist** — Audit log em cada visualização de dados sensíveis

---

#### C2. Seção de Alertas Clínicos (coluna direita)

**Aba: Alertas de Anamnese**

* Puxa automaticamente da tabela `anamnesis`
* Destaca: alergias críticas, medicamentos contraindicados, condições relevantes
* Exibe: pergunta da anamnese + resposta em negrito
* Link para ficha de anamnese completa

**Aba: Alertas Gerais**

* Produto vencido usado em sessão anterior
* Sessão com compliance score < 50 sem resolução
* Consentimento não assinado

**Aba: Alertas de Retorno**

* Lista de retornos agendados e pendentes
* Destaque para retornos vencidos (> data recomendada)

**Skills:**

* 🎨 **Frontend Engineer** — Componente `PatientAlerts` com abas shadcn/ui
* ⚙️ **Backend Engineer** — `AlertService` que consolida alertas de múltiplas tabelas
* ✅ **Compliance Auditor** — Regras de flags clínicas (anamnese, consentimento, lote)

---

#### C3. Seção de Agendamentos do Paciente

* Lista cronológica de todos os agendamentos (futuros e passados)
* Status por cor: ■ Agendado | ■ Confirmado | ■ Concluído | ■ Cancelado | ■ Faltou
* Ações por agendamento: Editar | Cancelar | Enviar lembrete WhatsApp
* Botão "Novo Agendamento" contextual ao paciente

**Skills:**

* 🎨 **Frontend Engineer** — Lista com scroll, badges de status coloridos
* ⚙️ **Backend Engineer** — Query de `appointments` filtrada por `patient_id`

---

#### C4. Seção de Histórico de Sessões / Evolução

* Tabela: Data | Profissional | Procedimento | Região | Produto/Lote | Situação | Compliance Score | Ações
* Filtros: Por procedimento | Por período | Por compliance
* Status de cada sessão: Em aberto | Finalizado | Revisão pendente
* Expandir linha para ver detalhes completos da sessão
* Botão "Registrar Evolução" (nova sessão)

**Skills:**

* 🎨 **Frontend Engineer** — Tabela expansível com shadcn/ui `Collapsible`
* ⚙️ **Backend Engineer** — `SessionService.listByPatient(patientId)` com joins
* ✅ **Compliance Auditor** — Exibir compliance score por sessão com badge colorido

---

#### C5. Seção: Plano de Tratamento / Protocolos

**Novo módulo inspirado em "Último Tratamento" do Dental Office:**

* Protocolo ativo: lista de procedimentos planejados com status (A realizar | Realizado | Cancelado)
* Botão "Adicionar procedimento ao plano"
* Previsão de próximas sessões (baseada no protocolo)

**Skills:**

* 🗄️ **Database Architect** — Nova tabela `treatment_plans` + `treatment_plan_procedures`
* ⚙️ **Backend Engineer** — `TreatmentPlanService`
* 🎨 **Frontend Engineer** — Timeline de tratamento visual

---

#### C6. Seção: Próximos Vencimentos Financeiros

* Mini-tabela: Vencimento | Tipo (Orçamento/Fatura) | Valor | Status
* Indicação de inadimplência em vermelho
* Link para módulo financeiro completo

**Skills:**

* 💰 **Financial Specialist** — Query de `financial_records` por `patient_id` com filtro de status
* 🎨 **Frontend Engineer** — Componente `PatientFinancialSummary`

---

#### C7. Seção: Galeria de Fotos Antes/Depois

* Grid de fotos agrupadas por sessão
* Visualização comparativa (antes | depois) com slider
* Upload de nova foto vinculada à sessão
* Metadata: data, sessão, procedimento, consentimento

**Skills:**

* 🎨 **Frontend Engineer** — Grid comparativo com zoom, slider before/after
* 🔒 **Security/LGPD Specialist** — Bucket privado, signed URLs 1h, metadata de consentimento
* ⚙️ **Backend Engineer** — Upload + geração de signed URLs via Supabase Storage

---

#### C8. Seção: Documentos Assinados

* Lista de documentos do paciente: Termo de Consentimento, Anamnese, Orçamentos
* Status: Assinado ✅ | Pendente ⏳ | Expirado ❌
* Ação: Visualizar PDF | Reenviar para assinatura

**Skills:**

* 💰 **Financial Specialist** — PDF templates para documentos clínicos
* 🎨 **Frontend Engineer** — Lista de documentos com status badge
* 🔒 **Security/LGPD Specialist** — Acesso a documentos via signed URL

---

### 🟣 GRUPO D — Funcionalidades de IA no Perfil do Paciente

#### D1. Assistente de IA Contextual (como no Dental Office)

* Botão flutuante "Assistente IA" dentro do perfil do paciente
* IA tem acesso ao contexto: anamnese, sessões anteriores, alertas
* Pode responder: "Qual o próximo procedimento recomendado para esta paciente?"
* Pode sugerir: protocolo baseado no histórico clínico

**Skills:**

* 📚 **RAG Specialist** — RAG contextualizado com dados do paciente
* 🧠 **NLP/NER Specialist** — Extração de contexto clínico
* ✅ **Compliance Auditor** — Disclaimer obrigatório em toda resposta de IA

---

#### D2. Sumarização Automática da Última Sessão

* Na aba de histórico, exibir resumo gerado por IA da última sessão
* Formato padronizado: procedimentos realizados + intercorrências + próximos passos

**Skills:**

* ✅ **Compliance Auditor** — Template de sumarização padronizado
* ⚙️ **Backend Engineer** — Endpoint `/api/ai/summarize/[session_id]`

---

#### D3. NER no Campo de Anotações Clínicas

* Campo de texto livre durante registro de sessão
* IA extrai automaticamente: produto, lote, quantidade, região, técnica
* Preview lateral do JSON estruturado extraído
* Profissional pode editar o resultado antes de salvar

**Skills:**

* 🧠 **NLP/NER Specialist** — Pipeline NER com LLM structured output
* 🎨 **Frontend Engineer** — Editor com preview do JSON extraído
* ⚙️ **Backend Engineer** — Endpoint `/api/ai/ner`

---

### 🔴 GRUPO E — Melhorias de Comunicação e Notificações

#### E1. Ações de Comunicação Rápida no Perfil

* Botão WhatsApp → abre chat com número do paciente pré-carregado
* Botão "Enviar lembrete" → envia mensagem de confirmação de consulta
* Botão "Enviar orçamento" → envia PDF via WhatsApp/e-mail

**Skills:**

* 🎨 **Frontend Engineer** — Botões de ação com Lucide icons no perfil
* ⚙️ **Backend Engineer** — Integração WhatsApp Business API (Edge Function)

---

#### E2. Timeline de Atividades do Paciente

* Log visual de todas as interações: sessões, pagamentos, mensagens, documentos
* Filtro por tipo de atividade
* Inspirado em CRMs como HubSpot / Salesforce

**Skills:**

* 🗄️ **Database Architect** — Tabela `patient_activity_log` (append-only)
* 🎨 **Frontend Engineer** — Componente de timeline vertical
* ⚙️ **Backend Engineer** — `ActivityService` que consolida eventos de múltiplas tabelas

---

## 📊 PARTE 4 — Resumo por Grupo e Skills

| Grupo                           | Funcionalidades                                                    | Skills Envolvidas                                                                 | Prioridade |
| ------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ---------- |
| **A — Listagem**         | Card enriquecido, filtros avançados, KPIs extras                  | 🎨 Frontend + ⚙️ Backend + 🔒 Security                                          | 🔴 Alta    |
| **B — Cadastro**         | Formulário multi-step 3 etapas                                    | 🎨 Frontend + ⚙️ Backend + 🗄️ DB + 🔒 Security                                | 🔴 Alta    |
| **C — Perfil 3 colunas** | Layout completo, alertas, sessões, plano, financeiro, fotos, docs | 🎨 Frontend + ⚙️ Backend + 🗄️ DB + ✅ Compliance + 💰 Financial + 🔒 Security | 🔴 Alta    |
| **D — IA no Perfil**     | Assistente IA, sumarização, NER                                  | 📚 RAG + 🧠 NLP/NER + ✅ Compliance + ⚙️ Backend                                | 🟡 Média  |
| **E — Comunicação**    | WhatsApp, timeline de atividades                                   | 🎨 Frontend + ⚙️ Backend                                                        | 🟢 Baixa   |

---

## 🏗️ Migrations e Tabelas Necessárias

Para suportar todas as melhorias, as seguintes alterações de banco serão necessárias:

```sql
-- Campos adicionais em patients
ALTER TABLE patients ADD COLUMN rg VARCHAR(20);
ALTER TABLE patients ADD COLUMN gender VARCHAR(20);
ALTER TABLE patients ADD COLUMN referral_source VARCHAR(100);
ALTER TABLE patients ADD COLUMN address JSONB;
-- address: { cep, street, number, complement, neighborhood, city, state }

-- Nova tabela: planos de tratamento
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'active', -- active, completed, cancelled
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE treatment_plan_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_plan_id UUID REFERENCES treatment_plans(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES procedure_catalog(id),
    facial_region VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending', -- pending, done, cancelled, observed
    scheduled_for DATE,
    done_at TIMESTAMPTZ,
    notes TEXT
);

-- Nova tabela: timeline de atividades
CREATE TABLE patient_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    activity_type VARCHAR(50), -- session, appointment, payment, document, message, note
    title TEXT,
    description TEXT,
    reference_id UUID, -- ID da entidade referenciada (sessão, agendamento, etc.)
    reference_type VARCHAR(50),
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Skills:**

* 🗄️ **Database Architect** — Migrations com RLS, índices e rollback
* 🔒 **Security/LGPD Specialist** — Políticas RLS em todas as tabelas novas

---

## ✅ Checklist de Entrega por Funcionalidade

```
LISTAGEM DE PACIENTES
  □ Card com foto, badges, alertas inline
  □ Filtro por abas Ativos/Inativos
  □ Filtros avançados (procedimento, compliance, retorno)
  □ Soft-delete no lugar de delete físico (LGPD)

CADASTRO MULTI-STEP
  □ 3 etapas com progress bar
  □ Validação CPF com dígitos verificadores
  □ CEP com auto-preenchimento
  □ Upload de foto no Supabase Storage (bucket privado)
  □ Nº de registro gerado automaticamente

PÁGINA DE PERFIL (3 COLUNAS)
  □ Coluna esquerda fixa com dados + ações rápidas
  □ Coluna central com agendamentos + histórico de sessões
  □ Coluna direita com alertas clínicos em 3 abas
  □ Seção de plano de tratamento
  □ Seção de vencimentos financeiros
  □ Galeria de fotos antes/depois
  □ Lista de documentos assinados
  □ Audit log em toda visualização de dados sensíveis
```

---

> 📌 **Próximo passo recomendado:** Iniciar pelo **Grupo A** (listagem enriquecida) + **Grupo B** (formulário multi-step), pois são a base que beneficia todas as funcionalidades subsequentes do perfil.
>
