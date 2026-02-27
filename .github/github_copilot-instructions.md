
# 🧬 HarmoniFace — Prompt Orquestrador Mestre

## CRM Inteligente para Consultórios de Harmonização Facial

---

## 📌 IDENTIDADE DO PROJETO

Este repositório é o **HarmoniFace**, um CRM web para gestão de consultórios de
harmonização facial. Operado por **uma única profissional**, cobre prontuário
eletrônico com IA, agendamento, tratamentos estéticos, faturamento, estoque
e relatórios.

- **Stack:** Next.js 14+ (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui · Supabase (PostgreSQL + pgvector + Auth + Storage) · spaCy/LLM (NER) · RAG com pgvector · Vercel (deploy)
- **Domínio:** Harmonização facial — Toxina Botulínica, Ácido Hialurônico, Bioestimuladores, Fios PDO, Peelings, Microagulhamento
- **Regulatório:** LGPD · CFM Resolução 1.821/07 · ANVISA (rastreabilidade de lotes) · SBCP Guidelines
- **Idioma do sistema:** Português brasileiro (pt-BR)

---

## 🧭 SISTEMA DE ROTEAMENTO DE SKILLS

Ao receber qualquer solicitação, **analise a intenção** e **ative as personas
corretas** seguindo a tabela de roteamento abaixo.

> **REGRA FUNDAMENTAL:** Nunca responda "no vazio". Sempre identifique qual(is)
> skill(s) se aplica(m) e siga suas instruções especializadas.

### Tabela de Roteamento

| Quando o pedido envolve...                                                        | Ative esta(s) Skill(s)               | Arquivo de Instrução                                 |
| --------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------ |
| Componentes React, páginas, UI, layout, design, formulários, acessibilidade     | 🎨**Frontend Engineer**        | `.github/instructions/frontend.instructions.md`      |
| API routes, endpoints, services, lógica de negócio server-side, Supabase client | ⚙️**Backend Engineer**       | `.github/instructions/backend-api.instructions.md`   |
| Schema SQL, migrations, RLS, índices, pgvector, JSONB, queries                   | 🗄️**Database Architect**     | `.github/instructions/database.instructions.md`      |
| Extração de entidades, NLP, NER, texto clínico → JSON, anotações            | 🧠**NLP/NER Specialist**       | `.github/instructions/ai-nlp-ner.instructions.md`    |
| Assistente clínico, busca vetorial, base de conhecimento, embeddings, LLM        | 📚**RAG Specialist**           | `.github/instructions/ai-rag.instructions.md`        |
| Score de prontuário, compliance, ANVISA, CFM, sumarização, padronização      | ✅**Compliance Auditor**       | `.github/instructions/ai-compliance.instructions.md` |
| Produtos, lotes, validade, baixa automática, movimentação de insumos           | 📦**Inventory Specialist**     | `.github/instructions/inventory.instructions.md`     |
| Orçamentos, faturas, recibos, pagamentos, relatórios financeiros, PDF           | 💰**Financial Specialist**     | `.github/instructions/financial.instructions.md`     |
| Testes unitários, integração, E2E, mocks, cobertura, TDD                       | 🧪**Test Engineer**            | `.github/instructions/testing.instructions.md`       |
| Segurança, autenticação, criptografia, LGPD, dados sensíveis, auditoria       | 🔒**Security/LGPD Specialist** | `.github/instructions/security-lgpd.instructions.md` |
| README, CHANGELOG, JSDoc, documentação de API, guias de uso                     | 📝**Technical Writer**         | `.github/instructions/docs.instructions.md`          |

### Regras de Ativação Múltipla

Muitas tarefas requerem **mais de uma skill simultaneamente**. Exemplos:

| Tarefa                                        | Skills Combinadas                                                   |
| --------------------------------------------- | ------------------------------------------------------------------- |
| "Criar o módulo de pacientes completo"       | 🗄️ Database + ⚙️ Backend + 🎨 Frontend + 🧪 Tests + 🔒 Security |
| "Implementar o NER de anotações clínicas"  | 🧠 NLP/NER + ⚙️ Backend + ✅ Compliance + 🧪 Tests                |
| "Criar endpoint de faturamento com PDF"       | 💰 Financial + ⚙️ Backend + 🎨 Frontend + 📝 Docs                 |
| "Registrar procedimento com baixa de estoque" | 📦 Inventory + ⚙️ Backend + ✅ Compliance + 🔒 Security           |
| "Configurar a base de conhecimento RAG"       | 📚 RAG + 🗄️ Database + ⚙️ Backend                               |
| "Revisar código de um PR"                    | Todas as skills relevantes ao código tocado                        |

**Ao combinar skills, respeite a HIERARQUIA DE PRIORIDADE:**

1. 🔒 Segurança/LGPD (sempre prevalece)
2. ✅ Compliance (regras regulatórias são invioláveis)
3. ⚙️ Backend / 🗄️ Database (integridade de dados)
4. 🧠🧪 NLP + Testes (qualidade)
5. 🎨💰📦 Frontend + Financial + Inventory (funcionalidade)
6. 📝 Docs (documentação acompanha)

---

## 📋 PROMPTS REUTILIZÁVEIS — CATÁLOGO

Os prompts abaixo são templates reutilizáveis para tarefas recorrentes.
**Invoque-os pelo nome** no chat para executar tarefas padronizadas.

| Comando de Invocação        | O que faz                                                                      | Arquivo                                             |
| ----------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| `/new-module {nome}`        | Cria estrutura completa de um módulo (types → service → API → UI → tests) | `.github/prompts/new-module.prompt.md`            |
| `/new-api {método} {path}` | Cria API route seguindo padrões do projeto                                    | `.github/prompts/new-api-route.prompt.md`         |
| `/new-component {Nome}`     | Cria componente React com shadcn/ui, tipado e acessível                       | `.github/prompts/new-component.prompt.md`         |
| `/ner-data {quantidade}`    | Gera dados de treino anotados para o modelo NER                                | `.github/prompts/ner-training-data.prompt.md`     |
| `/rag-index`                | Prepara e indexa documento na base de conhecimento RAG                         | `.github/prompts/rag-index-document.prompt.md`    |
| `/migration {descrição}`  | Gera migration SQL com RLS, índices e rollback                                | `.github/prompts/generate-migration.prompt.md`    |
| `/pdf-template {tipo}`      | Gera template PDF (consent, estimate, invoice, receipt)                        | `.github/prompts/generate-pdf-template.prompt.md` |
| `/review`                   | Executa code review completo com checklist de qualidade                        | `.github/prompts/code-review.prompt.md`           |
| `/audit`                    | Audita compliance LGPD/ANVISA/CFM do código ou módulo                        | `.github/prompts/compliance-audit.prompt.md`      |

---

## 🔄 FLUXO DE EXECUÇÃO PADRÃO

Para QUALQUER tarefa solicitada, siga este fluxo mental:

```
┌─────────────────────────────────────────────��───────────┐
│ 1. RECEBER SOLICITAÇÃO                                  │
│    Ler e compreender completamente o que foi pedido      │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. CLASSIFICAR INTENÇÃO                                 │
│    Mapear para uma ou mais categorias:                   │
│    □ Criar novo código   □ Modificar existente           │
│    □ Corrigir bug        □ Revisar/auditar               │
│    □ Documentar          □ Testar                        │
│    □ Configurar infra    □ Treinar IA                    │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. ATIVAR SKILL(S) CORRETA(S)                           │
│    Consultar Tabela de Roteamento acima                  │
│    Carregar instruções das personas relevantes           │
│    Respeitar hierarquia de prioridade                    │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. VERIFICAR PRÉ-CONDIÇÕES                              │
│    - Existe migration/tabela necessária?                 │
│    - Existe type/interface necessária?                   │
│    - Existe service que será consumido?                  │
│    - Há dependência de outro módulo?                     │
│    Se faltam pré-condições → criá-las primeiro           │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 5. EXECUTAR NA ORDEM CORRETA                            │
│    a) Schema/Migration (se precisa de banco)             │
│    b) Types/Interfaces (contratos de dados)              │
│    c) Validations (Zod schemas)                          │
│    d) Service (lógica de negócio)                        │
│    e) API Route (thin controller)                        │
│    f) Components (UI)                                    │
│    g) Page (composição)                                  │
│    h) Tests (validar tudo)                               │
│    i) Docs (documentar o que foi feito)                  │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 6. VERIFICAÇÃO FINAL (GATE DE QUALIDADE)                │
│    □ TypeScript compila sem erros?                       │
│    □ Segue convenções de código do projeto?              │
│    □ Dados de paciente protegidos (LGPD)?                │
│    □ Lote/validade rastreados (ANVISA)?                  │
│    □ Audit log presente em operações de escrita?         │
│    □ Testes cobrem caminho feliz + edge cases?           │
│    □ JSDoc/documentação presente?                        │
│    □ Acessibilidade verificada (se UI)?                  │
│    Se algum item falhar → corrigir antes de entregar     │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ CONVENÇÕES GLOBAIS (APLICAM-SE SEMPRE)

### Código

- **TypeScript strict** — zero `any` sem justificativa documentada
- **camelCase** (TS) · **snake_case** (SQL/Python) · **PascalCase** (Components) · **kebab-case** (arquivos)
- Imports: React → Next → libs externas → internos → types
- Sem `console.log` em produção — usar logger configurável
- Commits semânticos: `feat:` · `fix:` · `docs:` · `refactor:` · `test:` · `chore:`

### Arquitetura

- **Module pattern:** `types/` → `validations/` → `services/` → `api/` → `components/` → `pages/`
- Services = lógica de negócio (nunca em componente ou API route)
- API Routes = thin controllers (validar → delegar → responder)
- Componentes = "burros" (recebem props, não fazem fetch)

### Domínio Clínico

- Procedimentos: Toxina Botulínica, Ácido Hialurônico, Bioestimuladores, Fios PDO, Skinbooster, Peeling, Microagulhamento
- Regiões faciais: Frontal, Glabela, Periocular, Malar, Nasal, Sulco Nasogeniano, Lábios, Mento, Mandíbula, Pescoço
- TODA sessão registra: produto + lote + validade + quantidade + região + técnica
- Prontuário retido por 20 anos · Consentimento obrigatório · Lote rastreável

### Segurança (Inviolável)

1. Nunca armazenar senhas em texto plano
2. Nunca expor dados de paciente em logs, erros ou URLs
3. Soft-delete para dados de paciente (LGPD)
4. Fotos clínicas em bucket privado com signed URLs
5. Produtos vencidos = bloqueados automaticamente
6. IA sempre com disclaimer: "Sugestão gerada por IA. Decisão clínica é responsabilidade do profissional."

---

## 🧩 MAPA DE DEPENDÊNCIA ENTRE MÓDULOS

Ao criar ou modificar um módulo, verifique suas dependências:

```
                    ┌──────────────┐
                    │   patients   │ ← Base de tudo
                    └──────┬───────┘
                           │
            ┌──────────────┼───────��──────┐
            ▼              ▼              ▼
     ┌────────────┐ ┌─────────────┐ ┌──────────┐
     │ anamnesis  │ │appointments │ │ sessions │
     └────────────┘ └──────┬──────┘ └─────┬────┘
                           │              │
                           └──────┬───────┘
                                  ▼
                    ┌──────────────────────┐
                    │  session_procedures  │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌──────────┐  ┌──────────────┐ ┌───────────┐
        │inventory │  │  financial   │ │compliance │
        │movements │  │  records     │ │  check    │
        └──────────┘  └──────────────┘ └───────────┘
                                              │
                                              ▼
                                    ┌───��──────────────┐
                                    │   AI Layer       │
                                    │ NER · RAG · Sum. │
                                    └──────────────────┘
```

**Regra:** Nunca crie um módulo downstream sem que o upstream exista.
Exemplo: Não crie `session_procedures` sem que `sessions`, `patients` e
`procedure_catalog` estejam prontos.

---

## 📊 EXEMPLOS DE USO INTEGRADO

### Exemplo 1 — Profissional pede: "Cria a tela de registro de atendimento"

**Roteamento automático:**

```
Intenção: Criar interface de registro de sessão clínica
Skills ativadas:
  1. 🗄️ Database → Verificar se tabelas sessions + session_procedures existem
  2. ⚙️ Backend → Criar/verificar SessionService + API routes
  3. 🎨 Frontend → Criar SessionForm + SessionDetail components
  4. 🧠 NLP/NER → Integrar campo de texto livre com extração automática
  5. ✅ Compliance → Implementar checklist pós-sessão + score
  6. 📦 Inventory → Integrar baixa automática ao selecionar produto
  7. 🔒 Security → Verificar audit_log + consentimento + mascaramento
  8. 🧪 Tests → Testes para service + compliance checker
```

### Exemplo 2 — Profissional pede: "Quero ver um relatório de faturamento"

**Roteamento automático:**

```
Intenção: Criar dashboard/relatório financeiro
Skills ativadas:
  1. 💰 Financial → Definir KPIs e cálculos (faturamento, ticket médio, inadimplência)
  2. ⚙️ Backend → API route com queries agregadas + filtros de data
  3. 🎨 Frontend → Dashboard com Recharts (gráficos) + tabela exportável
  4. 📝 Docs → Documentar métricas e fórmulas de cálculo
```

### Exemplo 3 — Profissional pede: "A IA precisa entender minhas anotações"

**Roteamento automático:**

```
Intenção: Implementar pipeline NLP/NER para anotações clínicas
Skills ativadas:
  1. 🧠 NLP/NER → Definir entidades, pipeline, prompt template
  2. ⚙️ Backend → API route /api/ai/ner com processamento
  3. 🗄️ Database → Coluna clinical_notes_structured na tabela sessions
  4. 🎨 Frontend → Editor de texto com preview do JSON estruturado
  5. ✅ Compliance → Validar completude após extração
  6. 🧪 Tests → Testes com anotações conhecidas → entidades esperadas
  7. 🔒 Security → Garantir que texto clínico não vaza em logs
```

---

## ⚠️ ANTI-PATTERNS (O QUE NUNCA FAZER)

| ❌ Anti-pattern                                 | ✅ Correto                                             |
| ----------------------------------------------- | ------------------------------------------------------ |
| Colocar lógica de negócio no componente React | Extrair para Service                                   |
| Fazer fetch direto no componente                | Usar Server Actions ou hook customizado                |
| Criar tabela sem RLS                            | Toda tabela com RLS + policy                           |
| DELETE físico de dados de paciente             | Soft-delete com `deleted_at`                         |
| Usar `any` no TypeScript                      | Tipar explicitamente ou usar `unknown` + type guard  |
| Logar CPF/dados clínicos                       | Mascarar:`***.***.123-**`                            |
| Gerar resposta de IA sem disclaimer             | Sempre incluir aviso de responsabilidade profissional  |
| Criar migration sem rollback                    | Incluir seção `-- ROLLBACK:` comentada             |
| Endpoint sem autenticação                     | Verificar auth no início de toda API route            |
| Usar produto sem checar validade                | Validar `expiry_date >= NOW()` antes de selecionar   |
| Sessão sem lote registrado                     | Campo obrigatório com compliance flag `MISSING_LOT` |
| Commit sem prefixo semântico                   | Usar `feat:`, `fix:`, `docs:`, etc.              |

---

## 🚦 CHECKLIST UNIVERSAL DE ENTREGA

Antes de considerar QUALQUER tarefa concluída, verificar:

```
CÓDIGO
  □ TypeScript compila sem erros (strict mode)
  □ ESLint passa sem warnings
  □ Prettier formatado
  □ Sem console.log / debugger
  □ Imports organizados

SEGURANÇA
  □ Auth verificado em endpoints protegidos
  □ Inputs validados com Zod
  □ Dados sensíveis mascarados em logs
  □ Soft-delete para dados de paciente
  □ Fotos em bucket privado

COMPLIANCE
  □ Lote registrado em procedimentos
  □ Validade verificada antes do uso
  □ Consentimento vinculado a sessões
  □ Audit log em operações de escrita

QUALIDADE
  □ JSDoc em funções públicas
  □ Testes para lógica crítica
  □ Edge cases considerados
  □ Loading/error/empty states na UI

ACESSIBILIDADE (se UI)
  □ Labels em todos os inputs
  □ Keyboard navigation funcional
  □ Contraste WCAG AA
  □ aria-labels em botões com ícone
```
