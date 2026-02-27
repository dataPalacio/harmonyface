# 🚀 Configuração e Validação do HarmoniFace CRM

## Guia Completo de Setup e Testes

---

## ÍNDICE

1. [Pré-requisitos](#pré-requisitos)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Instalação de Dependências](#instalação-de-dependências)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Inicialização do Projeto](#inicialização-do-projeto)
6. [Testes de Validação](#testes-de-validação)
7. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Certifique-se de que você tem instalado:

- **Node.js** ≥ 18.17.0 (LTS recomendado)
- **npm** ≥ 9.0.0 ou **yarn** ≥ 3.6.0
- **Git** ≥ 2.40.0
- **Conta Supabase** (gratuita em https://supabase.com)
- **VSCode** ou editor similar (opcional, mas recomendado)

### Verificar versões instaladas

```bash
node --version       # Deve retornar v18.x.x ou superior
npm --version        # Deve retornar 9.x.x ou superior
git --version        # Deve retornar 2.x.x ou superior
```

---

## Instalação da CLI do Supabase

### ⚠️ IMPORTANTE: npm NÃO funciona para Supabase CLI no Windows

Se você tentou e recebeu erro:
```
npm error Installing Supabase CLI as a global module is not supported.
```

Use uma destas opções:

**Opção 1: Script Automatizado (MAIS FÁCIL) ⭐**

```powershell
cd c:\git-clones\harmonyface
.\\install-supabase-cli.ps1
```

Isso instala Scoop + Supabase CLI automaticamente.

**Opção 2: Instalar Manualmente via Scoop**

```powershell
# Permitir scripts (primeira vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar Scoop
iwr -useb get.scoop.sh | iex

# Instalar Supabase
scoop install supabase

# Verificar
supabase --version
```

**Opção 3: Ver [SUPABASE_CLI_INSTALL.md](SUPABASE_CLI_INSTALL.md)**

Guia completo com 3 métodos de instalação.

---

## Variáveis de Ambiente

### 1. Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo chamado `.env.local`:

```bash
cd c:\git-clones\harmonyface
touch .env.local
# ou no Windows
# New-Item -ItemType File -Name ".env.local"
```

### 2. Preencher variáveis obrigatórias

```env
# Supabase - OBRIGATÓRIO
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Supabase Server Key (para API routes - CONFIDENCIAL)
SUPABASE_SERVICE_ROLE_KEY=sua-chave-servico-aqui

# Email Admin (para alertas de estoque)
ADMIN_EMAIL=admin@harmoniface.com

# AI Services - OPCIONAL (para funcionalidades avançadas)
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_GROQ_API_KEY=gsk_...

# Notificações - OPCIONAL
RESEND_API_KEY=re_...
```

### 3. Obter credenciais do Supabase

1. Acesse https://supabase.com e faça login
2. Crie um novo projeto (ou selecione existente)
3. Vá para **Settings → API**
4. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (guardar com segurança)

---

## Instalação de Dependências

### 1. Limpar instalações anteriores (se necessário)

```bash
cd c:\git-clones\harmonyface

# Remover node_modules e locks
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Ou no bash:
# rm -rf node_modules package-lock.json
```

### 2. Instalar dependências

```bash
npm install
```

**Esperado:** Deve completar em 2-5 minutos sem erros.

### 3. Verificar instalação

```bash
npm list --depth=0
```

**Esperado:** Deve listar todas as dependências principais.

### 4. Instalar dependências adicionais (se necessário)

Se alguma dependência importante estiver faltando:

```bash
# Charts (dashboards)
npm install recharts

# Testing
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test

# Build analyzer
npm install -D @next/bundle-analyzer

# Analytics (opcional)
npm install @vercel/analytics
```

---

## Configuração do Banco de Dados

### ⚠️ IMPORTANTE: Ordem de Execução das Migrations

As migrations devem ser executadas **NA ORDEM CORRETA**:

1. **202602270001_create_base_schema.sql** (Cria todas tabelas base: patients, appointments, sessions, etc)
2. **202602270002_phase5_notification_logs.sql** (Cria notification_logs com referências corretas)

### 1. Estabelecer conexão com Supabase

Supabase já deve estar configurado via `.env.local`.

### 2. Executar migrations ✅ CORRIGIDO

#### Opção A: CLI do Supabase (Recomendado)

```bash
# Instalar CLI (se não tiver)
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Executar migrations (na ordem correta)
supabase db push
```

**Esperado:** Retorna:
```
✓ Migrating schema out of band
✓ Applied migrations listed below...
✓ 202602270001_create_base_schema
✓ 202602270002_phase5_notification_logs
```

#### Opção B: Manual via Dashboard Supabase (Se CLI não funcionar)

**IMPORTANTE: Executar NESTA ORDEM:**

**Passo 1:** Criar schema base
1. Vá para Supabase Dashboard → **SQL Editor**
2. Abra arquivo: `supabase/migrations/202602270001_create_base_schema.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique **RUN** (ou Ctrl+Enter)
6. Aguarde conclusão (deve retornar sem erros)

**Passo 2:** Criar notification logs
1. Abra arquivo: `supabase/migrations/202602270002_phase5_notification_logs.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor (criar nova query)
4. Clique **RUN**

**⚠️ SE HOUVER ERRO:**
- Erro: "relation "appointments" does not exist" → Executou fora de ordem, refaça desde o passo 1
- Erro: "already exists" → Tabela já foi criada, pode ignorar (é idempotente)
- Erro: "syntax error" → Copie TUDO da migration, não parcialmente

### 3. Verificar Migration Executada

No **SQL Editor**, execute:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Esperado:** Retorna 13 linhas:
```
✅ anamnesis
✅ appointments
✅ audit_log
✅ document_templates
✅ financial_records
✅ inventory
✅ inventory_movements
✅ knowledge_base
✅ notification_logs
✅ patients
✅ procedure_catalog
✅ session_procedures
✅ sessions
```

### 4. Seed de dados (Catálogo de Procedimentos)

Inserir dados iniciais no Supabase Dashboard → **SQL Editor**:

```sql
-- Procedimentos padrão
INSERT INTO procedure_catalog (name, category, description, default_duration_min, facial_regions)
VALUES
  ('Toxina Botulínica', 'Neurotoxina', 'Aplicação de Botox em região facial', 30, '["glabela","frontal","periocular"]'),
  ('Preenchimento HA', 'Preenchimento', 'Ácido Hialurônico em lábios/faces', 45, '["labios","malar","mandibula"]'),
  ('Peeling Químico', 'Peeling', 'Peeling químico para rejuvenescimento', 60, '["face","decote"]'),
  ('Microagulhamento', 'Estimulação', 'Microagulhamento com drug delivery', 50, '["face"]'),
  ('Fios de PDO', 'Estimulação', 'Fios de sustentação com estimulação', 40, '["face","mandibula"]'),
  ('Skinbooster', 'Injeção', 'Mesoterapia e hidratação profunda', 45, '["face","decote","maos"]');
```

**Esperado:** Retorna `6 rows inserted`

### 5. Validar Indices Criados

No **SQL Editor**, execute:

```sql
-- Verificar índices de notification_logs
SELECT indexname FROM pg_indexes 
WHERE tablename = 'notification_logs'
ORDER BY indexname;
```

**Esperado:** Retorna 7+ índices:
```
✅ idx_notification_logs_appointment_id
✅ idx_notification_logs_patient_id
✅ idx_notification_logs_session_id
✅ idx_notification_logs_status
✅ idx_notification_logs_sent_at
✅ idx_notification_logs_type
✅ idx_notification_logs_type_status
```

### 6. Validar RLS Policies

No **SQL Editor**, execute:

```sql
-- Verificar policies
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'notification_logs'
ORDER BY policyname;
```

**Esperado:** Retorna 2 policies:
```
✅ authenticated_can_insert_notification_logs (INSERT)
✅ authenticated_can_select_notification_logs (SELECT)
```

---

## Inicialização do Projeto

### 1. Verificar compilação TypeScript

```bash
npm run build
```

**Esperado após 30-60 segundos:**

```
✓ Creating an optimized production build
✓ Compiled successfully
```

**Problemas comuns:**

- Import não encontrado: Verifique se o arquivo existe em `src/`
- Tipo não definido: Verifique `src/types/`

### 2. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

**Esperado após 10-15 segundos:**

```
  ▲ Next.js 14.x
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

### 3. Acessar a aplicação

Abra navegador em: **http://localhost:3000**

**Esperado:**

- Home page carrega sem erros
- Nenhum erro no console do navegador
- Nenhum erro no terminal

---

## 🔧 Recuperação de Erro de Migração

### Se você recebeu erro: "relation 'appointments' does not exist"

**Causa:** A migração antiga foi executada sem as tabelas base.

**Solução:**

1. **Limpar Supabase (Opção A - Recomendado):**
   
   ```sql
   -- Executar no Supabase SQL Editor
   -- ⚠️ CUIDADO: Isto deleta dados
   
   DROP TABLE IF EXISTS notification_logs CASCADE;
   DROP TABLE IF EXISTS inventory_movements CASCADE;
   DROP TABLE IF EXISTS session_procedures CASCADE;
   DROP TABLE IF EXISTS financial_records CASCADE;
   DROP TABLE IF EXISTS inventory CASCADE;
   DROP TABLE IF EXISTS document_templates CASCADE;
   DROP TABLE IF EXISTS audit_log CASCADE;
   DROP TABLE IF EXISTS knowledge_base CASCADE;
   DROP TABLE IF EXISTS sessions CASCADE;
   DROP TABLE IF EXISTS appointments CASCADE;
   DROP TABLE IF EXISTS anamnesis CASCADE;
   DROP TABLE IF EXISTS procedure_catalog CASCADE;
   DROP TABLE IF EXISTS patients CASCADE;
   ```

2. **Executar migrations na ordem correta:**

   ```bash
   # Via CLI (recomendado)
   supabase db push
   
   # OU manualmente (seguir Seção 4: "Configuração do Banco de Dados")
   ```

3. **Validar sucesso:**
   
   ```bash
   # Ou no SQL Editor
   SELECT COUNT(DISTINCT table_name) FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   
   **Esperado:** Retorna **13** (13 tabelas criadas)

---

## Testes de Validação

### ✅ CHECKLIST DE VALIDAÇÃO

Execute os testes na seguinte ordem:

---

### 1️⃣ Validação de Frontend (UI)

#### 1.1 Dashboard carrega

```
URL: http://localhost:3000/reports
Esperado:
  ✅ Página carrega sem erro 404
  ✅ Título "Dashboard" visível
  ✅ 12 cards de KPI aparecem (podem estar vazios)
  ✅ 3 abas aparecem (Overview, Financial, Clinical)
```

**Ação:** Abra browser em `http://localhost:3000/reports`

#### 1.2 Validar abas do dashboard

```
Esperado:
  ✅ Aba "Overview" mostra 12 KPI cards + 3 gráficos
  ✅ Aba "Financial" mostra KPIs financeiros + gráfico de receita
  ✅ Aba "Clinical" mostra KPIs clínicos + gráfico de distribuição
  ✅ Nome das abas corretos em português
```

**Ação:** Clique em cada aba

#### 1.3 Validar componentes gráficos

```
Esperado:
  ✅ Revenue Chart (gráfico de linha) renderiza
  ✅ Procedure Chart (gráfico pizza) renderiza
  ✅ Nenhuma mensagem de erro no console (F12 → Console)
```

**Ação:** Abra DevTools (F12) e vá para aba Console

#### 1.4 Responsividade (Mobile)

```
Esperado:
  ✅ Dashboard adapta para mobile (aba no Firefox responsive mode)
  ✅ Cards visíveis em telas pequenas
  ✅ Sem overflow horizontal
```

**Ação:** F12 → Toggle device toolbar (Ctrl+Shift+M)

---

### 2️⃣ Validação de APIs (Backend)

#### 2.1 Health Check

```bash
curl http://localhost:3000/api/health
```

**Esperado:**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-27T10:30:00Z",
  "database": "connected"
}
```

**Note:** Criar `/api/health` se não existir (ver seção Deployment Guide)

#### 2.2 Teste de Report API - JSON

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "type": "financial",
    "format": "json",
    "filters": {
      "startDate": "2026-02-01",
      "endDate": "2026-02-28"
    }
  }'
```

**Esperado:**

```json
{
  "data": {
    "summary": {
      "totalRevenue": 0,
      "netIncome": 0,
      "transactionCount": 0
    },
    "byProcedure": [],
    "byPaymentMethod": [],
    ...
  }
}
```

**Status HTTP esperado:** 200

#### 2.3 Teste de Report API - CSV

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "type": "clinical",
    "format": "csv",
    "filters": {
      "startDate": "2026-02-01",
      "endDate": "2026-02-28"
    }
  }'
```

**Esperado:**

```json
{
  "data": {
    "filename": "clinical_report_2026-02-27.csv",
    "url": "data:text/csv;base64,...",
    "sizeBytes": 245
  }
}
```

#### 2.4 Teste de Notifications API - Email

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_email",
    "data": {
      "to": "test@example.com",
      "subject": "Test Email",
      "body": "Esta é uma mensagem de teste do HarmoniFace"
    }
  }'
```

**Esperado:**

- Status HTTP: 200
- Terminal mostra: `📧 Email enviado: test@example.com`
- Supabase notification_logs tem novo registro

#### 2.5 Validar Database Audit

```sql
-- No Supabase SQL Editor
SELECT COUNT(*) FROM notification_logs;
```

**Esperado:** Número de registros aumenta a cada teste

---

### 3️⃣ Validação de Banco de Dados

#### 3.1 Tabelas existem

Supabase Dashboard → Table Editor

```
✅ patients                (0 linhas até agora - OK)
✅ procedure_catalog       (6 linhas - dados seed)
✅ appointments            (0 linhas - OK)
✅ sessions                (0 linhas - OK)
✅ session_procedures      (0 linhas - OK)
✅ inventory               (0 linhas - OK)
✅ inventory_movements     (0 linhas - OK)
✅ anamnesis               (0 linhas - OK)
✅ financial_records       (0 linhas - OK)
✅ document_templates      (0 linhas - OK)
✅ audit_log               (0 linhas - OK)
✅ knowledge_base          (0 linhas - OK)
✅ notification_logs       (será preenchida nos testes)
```

#### 3.2 RLS (Row Level Security) habilitado

Supabase Dashboard → Authentication → Policies

```
✅ notification_logs:
   - authenticated_can_select_notification_logs (SELECT)
   - authenticated_can_insert_notification_logs (INSERT)
```

#### 3.3 Índices criados

Supabase Dashboard → SQL Editor:

```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'notification_logs';
```

**Esperado:** Retorna 7+ índices

```
✅ idx_notification_logs_appointment_id
✅ idx_notification_logs_patient_id  
✅ idx_notification_logs_session_id
✅ idx_notification_logs_status
✅ idx_notification_logs_sent_at
✅ idx_notification_logs_type
✅ idx_notification_logs_type_status
```

---

### 4️⃣ Validação de Código TypeScript

#### 4.1 Sem erros de compilação

```bash
npm run build
```

**Esperado:**

```
✓ Compiled successfully
✓ Generated static pages
```

**Se houver erro:** Mostra qual arquivo e qual tipo

#### 4.2 Lint sem avisos

```bash
npm run lint
# ou
npx eslint src/
```

**Esperado:** Sem erros (avisos OK para MVP)

#### 4.3 Type check

```bash
npx tsc --noEmit
```

**Esperado:** Sem erros de tipo

---

### 5️⃣ Validação de Dependências

#### 5.1 Verificar importações críticas

```bash
npm ls recharts
npm ls @supabase/supabase-js
npm ls next
```

**Esperado:** Todas instaladas sem conflitos

#### 5.2 Security audit

```bash
npm audit
```

**Esperado:** 0 vulnerabilities críticas

```
found X vulnerabilities
  X critical, X high, X moderate, X low
```

Se houver críticas: `npm audit fix`

---

### 6️⃣ Validação de Performance

#### 6.1 Lighthouse Score (Google Chrome)

1. Abra DevTools (F12)
2. Vá para aba "Lighthouse"
3. Clique "Analyze page load"

**Esperado para MVP:**

```
Performance:     ≥ 80
Accessibility:   ≥ 85
Best Practices:  ≥ 80
SEO:             ≥ 90
```

#### 6.2 Bundle Size

```bash
ANALYZE=true npm run build
```

Abre relatório interativo de tamanho de bundle.

**Esperado para MVP:**

```
First Load JS (main):  < 250KB (gzipped)
Next.js framework:     < 100KB
Total (all files):     < 500KB
```

#### 6.3 Build Time

Execute `npm run build` e verifique tempo total.

**Esperado:** < 60 segundos em máquina moderna

---

### 7️⃣ Validação Manual End-to-End (E2E)

#### 7.1 Criar paciente (Manual)

```
URL: http://localhost:3000/patients (se existir)

OU criar via API:
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Maria Silva",
    "cpf": "12345678900",
    "email": "maria@example.com",
    "phone": "11999999999"
  }'
```

**Esperado:** Retorna objeto patient com ID UUID

#### 7.2 Criar procedimento

```bash
curl -X POST http://localhost:3000/api/procedures \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Botox Frontal",
    "category": "Neurotoxina",
    "duration_min": 30,
    "facial_regions": ["frontal"]
  }'
```

**Esperado:** 200 Created com ID

#### 7.3 Criar agendamento

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "uuid-do-paciente",
    "procedure_id": "uuid-do-procedimento",
    "scheduled_at": "2026-03-10T14:00:00Z"
  }'
```

**Esperado:** 200 Created

#### 7.4 Registrar sessão

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "uuid-do-paciente",
    "appointment_id": "uuid-do-agendamento",
    "clinical_notes_raw": "Paciente Maria compareceu para aplicação de botox na glabela. 25 unidades Botox Allergan lote AB1234. Sem intercorrências.",
    "consent_signed": true
  }'
```

**Esperado:** 200 Created + NLP processa notas

#### 7.5 Gerar relatório

1. Abra http://localhost:3000/reports
2. Aba "Financial" → deve mostrar dados (se houver sesões com financial_records)
3. Aba "Clinical" → deve mostrar dados (se houver sessões)

**Esperado:** Gráficos renderizam com dados reais

---

## Troubleshooting

### Erro: "Cannot find module '@/lib/supabase/server'"

**Solução:**

```bash
# Verifique se tsconfig.json tem path aliases correto
cat tsconfig.json | grep -A 5 '"paths"'

# Deve ter:
# "@/*": ["./src/*"]
```

### Erro: "Supabase anon key not found"

**Solução:**

```bash
# Verifique .env.local existe
ls -la .env.local

# Se não existir, crie:
cp .env.example .env.local

# Preencha com valores reais do Supabase
```

### Erro: "Port 3000 is already in use"

**Solução:**

```bash
# Windows
Get-Process -Name node | Stop-Process -Force

# Linux/Mac
pkill -f "node"

# Ou use porta diferente:
npm run dev -- -p 3001
```

### Erro: "NextJS/React version mismatch"

**Solução:**

```bash
npm install next@latest react@latest react-dom@latest
npm install --save-dev @types/react@latest @types/node@latest
```

### Dashboard não mostra dados

**Verificar:**

1. Há dados em `sessions`?
   ```sql
   SELECT COUNT(*) FROM sessions;
   ```
2. Há dados em `appointments`?
   ```sql
   SELECT COUNT(*) FROM appointments;
   ```
3. Se 0, criar dados de teste via API

### Gráficos não renderizam

**Verificar:**

1. Recharts instalado?
   ```bash
   npm list recharts
   ```
2. Nenhum erro no console (F12)
3. Dados sendo retornados da API?
   ```bash
   curl http://localhost:3000/api/analytics/revenue-chart-data
   ```

### Email não envia

**Verificar:**

1. `ADMIN_EMAIL` definido em `.env.local`
2. Função `sendEmail()` sendo chamada
3. Console.log mostra: "📧 Email enviado"
4. Tabela `notification_logs` tem registro com `status='sent'`

---

## ✅ Checklist Final de Validação

Imprima este checklist e marque cada item:

```
PHASE 5 VALIDATION CHECKLIST
=============================

Frontend & UI:
☐ Dashboard carrega sem erro 404
☐ 12 KPI cards renderizam (Overview aba)
☐ Revenue Chart renderiza (gráfico de linha)
☐ Procedure Chart renderiza (gráfico pizza)
☐ 3 abas funcionam (Overview, Financial, Clinical)
☐ Responsivo em mobile (F12 → device toggle)

Backend & APIs:
☐ Health check retorna 200
☐ Reports API (JSON) retorna dados
☐ Reports API (CSV) retorna arquivo
☐ Notifications API envia email
☐ Todos endpoints autenticados (401 sem token)

Database:
☐ 13 tabelas existem no Supabase
☐ notification_logs tem 7+ índices
☐ RLS policies aplicadas (2 policies em notification_logs)
☐ Seed data carregado (6 procedimentos em procedure_catalog)
☐ Migrations executadas em ordem (202602270001, 202602270002)

Code Quality:
☐ npm run build completa sem erro
☐ npm run lint sem erros críticos
☐ npx tsc --noEmit sem erros
☐ npm audit sem vulnerabilidades críticas

Performance:
☐ Lighthouse Performance ≥ 80
☐ Build time < 60 segundos
☐ Bundle size < 300KB (gzipped)

Documentation:
☐ SETUP_AND_VALIDATION.md (este arquivo) atualizado
☐ Migrações executadas (202602270001 + 202602270002)
☐ Arquivo antigo deletado (202602270006_phase5_notifications.sql) ❌
☐ DEPLOYMENT_GUIDE.md revisado
☐ TESTING_GUIDE.md disponível
☐ PERFORMANCE_OPTIMIZATION.md disponível

Status Final:
☐ TUDO VERIFICADO - PRONTO PARA PRODUÇÃO ✅
```

---

## Próximos Passos

Se todos os testes passarem (✅):

1. **Backup do Supabase:**

   ```bash
   supabase db pull > backup-$(date +%Y%m%d).sql
   ```
2. **Deploy para Produção:**

   - Seguir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - Escolher entre: Vercel, Netlify, Railway ou Docker
3. **Integração de Produção:**

   - Integrar serviço de email real (Resend)
   - Integrar WhatsApp Business API
   - Configurar backups automáticos
4. **Treinamento:**

   - Treinar profissional no sistema
   - Importar catálogo completo de procedimentos
   - Configurar templates personalizados
5. **Go-live:**

   - Migrar dados de sistema anterior (se existir)
   - Ativar notificações
   - Monitorar performance (Vercel Analytics)

---

## Contato & Suporte

Para dúvidas:

- 📧 Email: dev@harmoniface.com
- 💬 GitHub Issues: harmoniface/issues
- 📱 WhatsApp Business: (configurar)

---

**Última atualização:** 27 de fevereiro de 2026
**Versão:** 1.0 (Phase 5 - Refinement Complete)
**Status:** ✅ Pronto para Validação e Produção
