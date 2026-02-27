# 🗄️ Guia de Migrations - HarmoniFace CRM

## Resumo do Problema e Solução

### ❌ Erro Original
```
Error: Failed to run sql query: 
ERROR: 42P01: relation "appointments" does not exist
```

### ✅ Causa
A migração `202602270006_phase5_notifications.sql` tentava referenciar a tabela `appointments` que não existia. As tabelas base (patients, appointments, sessions, etc) nunca foram criadas.

### ✅ Solução
Dividir em **2 migrations executadas em ordem**:
1. **202602270001_create_base_schema.sql** - Cria todas as 13 tabelas base
2. **202602270002_phase5_notification_logs.sql** - Cria notification_logs com referências corretas

---

## 🚀 Como Executar (Passo a Passo)

### Método 1: CLI do Supabase (RECOMENDADO)

#### Pré-requisito: Instalar Supabase CLI

⚠️ **IMPORTANTE:** `npm install -g supabase` não funciona no Windows.

**Opção A: Script Automatizado (MAIS FÁCIL):**

```powershell
# 1. Abra PowerShell na pasta do projeto
cd c:\git-clones\harmonyface

# 2. Executar script de instalação
.\\install-supabase-cli.ps1

# ✅ Esperado:
# ✅ Scoop instalado (ou já existia)
# ✅ Supabase CLI instalado
```

**Opção B: Manual com Scoop**

Ver [SUPABASE_CLI_INSTALL.md](SUPABASE_CLI_INSTALL.md) para:
- ✅ Opção 1: Scoop (RECOMENDADO)
- ✅ Opção 2: Chocolatey
- ✅ Opção 3: Download Direto

#### Executar Migrations

```powershell
# 1. Login
supabase login

# 2. Linkar projeto
supabase link --project-ref seu-project-ref
# Obter <seu-project-ref> em: Supabase Dashboard → Settings → General → Reference ID

# 3. Executar migrations
supabase db push

# ✅ Esperado:
# ✓ Migrating schema out of band
# ✓ Applied migrations:
# ✓ 202602270001_create_base_schema
# ✓ 202602270002_phase5_notification_logs
```

**Vantagens:**
- ✅ Automático
- ✅ Mantém ordem
- ✅ Rastreia histórico
- ✅ Reversível (se necessário)

---

### Método 2: Manual via Dashboard Supabase

Se a CLI não funcionar ou preferir manual:

#### Passo 1: Criar Schema Base

1. Abra: https://supabase.com → Dashboard → Seu Projeto
2. Vá para: **SQL Editor** (menu esquerdo)
3. Clique: **New Query**
4. Copie conteúdo completo de: `supabase/migrations/202602270001_create_base_schema.sql`
5. Cole no editor
6. Clique: **RUN** (ou Ctrl+Enter)
7. Aguarde até terminar (sem erros)

**Esperado:**
```
✓ Command executed successfully
(Sem mensagens de erro)
```

#### Passo 2: Criar Notification Logs

1. Clique: **New Query** (nova query)
2. Copie conteúdo completo de: `supabase/migrations/202602270002_phase5_notification_logs.sql`
3. Cole no editor
4. Clique: **RUN**
5. Aguarde até terminar

**Esperado:**
```
✓ Command executed successfully
(Sem mensagens de erro)
```

#### Passo 3: Validar

1. Vá para: **Database** → **Tables** (menu esquerdo)
2. Deve listar 13 tabelas:
   - anamnesis ✅
   - appointments ✅
   - audit_log ✅
   - document_templates ✅
   - financial_records ✅
   - inventory ✅
   - inventory_movements ✅
   - knowledge_base ✅
   - notification_logs ✅
   - patients ✅
   - procedure_catalog ✅
   - session_procedures ✅
   - sessions ✅

---

### Método 3: Se Houve Erro Anterior

Se você tentou executar a migração antiga e recebeu erro:

#### 1. Limpar Supabase (CUIDADO: Deleta dados)

```sql
-- Executar no Supabase SQL Editor → New Query

DROP TABLE IF EXISTS notification_logs CASCADE;
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS session_procedures CASCADE;
DROP TABLE IF EXISTS financial_records CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS document_templates CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF ENGINE appointments CASCADE;
DROP TABLE IF EXISTS anamnesis CASCADE;
DROP TABLE IF EXISTS procedure_catalog CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- Hit RUN
-- Esperado: ✓ Command executed successfully
```

#### 2. Então executar migrations na ordem correta

Via CLI:
```bash
supabase db push
```

Ou via manual (Método 2 acima)

---

## 📋 Conteúdo de Cada Migration

### Migration 1: 202602270001_create_base_schema.sql

**O que cria:**

| Tabela | Desccrição |
|--------|-----------|
| **patients** | Cadastro de pacientes (dados pessoais) |
| **anamnesis** | Anamnese (histórico médico) |
| **procedure_catalog** | Catálogo de procedimentos |
| **appointments** | Agendamentos |
| **sessions** | Sessões/atendimentos |
| **session_procedures** | Procedimentos realizados por sessão |
| **inventory** | Controle de estoque |
| **inventory_movements** | Movimentações de estoque |
| **financial_records** | Registros financeiros (faturamento) |
| **document_templates** | Templates de documentos |
| **audit_log** | Log de auditoria |
| **knowledge_base** | Base de conhecimento para RAG |

**Recursos:**
- ✅ 30+ índices para performance
- ✅ Foreign keys entre tabelas
- ✅ RLS policies habilitadas
- ✅ JsDoc comments em português

**Tamanho:** ~850 linhas

---

### Migration 2: 202602270002_phase5_notification_logs.sql

**O que cria:**

| Tabela | Descrição |
|--------|-----------|
| **notification_logs** | Audit trail de notificações (email, SMS, WhatsApp, push) |

**Colunas principais:**
- `type` - Tipo: email, sms, whatsapp, push
- `recipient` - Email/telefone destinatário
- `subject` - Assunto/título
- `body` - Corpo da mensagem
- `status` - pending, sent, failed, bounced, opened
- `appointment_id` - Referência ao agendamento (opcional)
- `session_id` - Referência à sessão (opcional)
- `patient_id` - Referência ao paciente (opcional)
- `metadata` - Dados adicionais (resposta de API, tokens, etc)

**Recursos:**
- ✅ 7 índices otimizados
- ✅ 2 RLS policies (SELECT e INSERT)
- ✅ Foreign keys com ON DELETE SET NULL
- ✅ Timestamps (created_at, sent_at, opened_at, updated_at)

**Tamanho:** ~120 linhas

---

## ✅ Verificação Pós-Migration

### Teste 1: Contar Tabelas

No SQL Editor:

```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Esperado:** `13`

### Teste 2: Listar Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Esperado:** Lista de 13 tabelas (ver acima)

### Teste 3: Verificar Índices

```sql
SELECT COUNT(*) as total_indexes
FROM pg_indexes 
WHERE schemaname = 'public';
```

**Esperado:** `30+` índices

### Teste 4: Verificar Policies RLS

```sql
SELECT * FROM pg_policies WHERE tablename = 'notification_logs';
```

**Esperado:** 2 policies:
- `authenticated_can_insert_notification_logs` (INSERT)
- `authenticated_can_select_notification_logs` (SELECT)

### Teste 5: Criar Dados de Teste

```sql
-- Inserir procedimentos padrão
INSERT INTO procedure_catalog (name, category, description, default_duration_min, facial_regions)
VALUES
  ('Toxina Botulínica', 'Neurotoxina', 'Botox', 30, '["glabela"]'),
  ('Preenchimento HA', 'Preenchimento', 'Ácido Hialurônico', 45, '["labios"]'),
  ('Peeling Químico', 'Peeling', 'Peeling', 60, '["face"]'),
  ('Microagulhamento', 'Estimulação', 'Microagulhamento', 50, '["face"]'),
  ('Fios de PDO', 'Estimulação', 'Fios de sustentação', 40, '["mandibula"]'),
  ('Skinbooster', 'Injeção', 'Mesoterapia', 45, '["face"]');

-- Verificar
SELECT COUNT(*) FROM procedure_catalog;
```

**Esperado:** 6 linhas inseridas em `procedure_catalog`

---

## 🔧 Troubleshooting

### Erro: "table already exists"

**Causa:** Tabela já foi criada anteriormente.

**Solução:** Pode ignorar (migration é idempotente). Ou deletar e refazer (Método 3).

### Erro: "relation 'X' does not exist"

**Causa:** Migrations executadas fora de ordem.

**Solução:**
1. Executar limpeza (Método 3 passo 1)
2. Refazer na ordem correta

### Erro: "token is expired"

**Causa:** Sessão Supabase expirou.

**Solução:**
```bash
supabase logout
supabase login
supabase link --project-ref seu-project-ref
supabase db push
```

### Erro: "syntax error at line X"

**Causa:** Arquivo SQL corrompido ou cópia incompleta.

**Solução:**
1. Abrir arquivo original em editor
2. Copiar TUDO (Ctrl+A → Ctrl+C)
3. Colar sem modificações
4. Executar

---

## 📚 Referências

- **Supabase Docs:** https://supabase.com/docs/guides/cli
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **HarmoniFace Docs:** Ver README.md e SETUP_AND_VALIDATION.md

---

## 🎯 Próximos Passos

Após migrations bem-sucedidas:

1. ✅ Executar SETUP_AND_VALIDATION.md (Seção 5 em diante)
2. ✅ Validar frontend (dashboard carrega)
3. ✅ Validar APIs (health check, reports)
4. ✅ Deploy para produção (DEPLOYMENT_GUIDE.md)

---

**Última atualização:** 27 de fevereiro de 2026  
**Status:** ✅ Migrations corrigidas e documentadas
