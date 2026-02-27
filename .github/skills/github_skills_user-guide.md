# Guia de Uso das Skills no GitHub Copilot (HarmoniFace)

Este guia explica como usar, de forma prática, os arquivos de skill da pasta `.github` para obter respostas melhores no Copilot Chat.

---

## 1) Como pensar em “skill”

Cada arquivo `github_instructions_*.instructions.md` funciona como uma especialização.

- Você descreve a tarefa.
- O Copilot ativa a(s) skill(s) correta(s).
- Quanto mais claro o contexto, melhor a entrega.

Regra prática: **toda tarefa real usa 2 ou mais skills**.

---

## 2) Skills disponíveis e quando usar

### 🎨 Frontend
Arquivo: `github_instructions_frontend.instructions.md`
Use para: páginas, componentes, formulários, responsividade, acessibilidade.

### ⚙️ Backend/API
Arquivo: `github_instructions_backend-api.instructions.md`
Use para: API routes, validação server-side, services, contratos de resposta.

### 🗄️ Database
Arquivo: `github_instructions_database.instructions.md`
Use para: schema SQL, migration, índices, RLS, JSONB, pgvector.

### 🧠 AI NLP/NER
Arquivo: `github_instructions_ai-nlp-ner.instructions.md`
Use para: extração de entidades clínicas (texto livre → JSON estruturado).

### 📚 AI RAG
Arquivo: `github_instructions_ai-rag.instructions.md`
Use para: busca vetorial, indexação de base de conhecimento, assistente clínico.

### ✅ AI Compliance
Arquivo: `github_instructions_ai-compliance.instructions.md`
Use para: score de prontuário, flags regulatórias, sumarização padronizada.

### 📦 Inventory
Arquivo: `github_instructions_inventory.instructions.md`
Use para: baixa automática, controle de validade, alertas e rastreabilidade.

### 💰 Financial
Arquivo: `github_instructions_financial.instructions.md`
Use para: orçamentos, faturas, recibos, status de cobrança, PDFs financeiros.

### 🧪 Testing
Arquivo: `github_instructions_testing.instructions.md`
Use para: unit tests, integração, E2E, cobertura e edge cases.

### 🔒 Security/LGPD
Arquivo: `github_instructions_security-lgpd.instructions.md`
Use para: autenticação, proteção de dados, soft-delete, auditoria, compliance LGPD.

### 📝 Docs
Arquivo: `github_instructions_docs.instructions.md`
Use para: README, CHANGELOG, guias de operação, documentação de API.

---

## 3) Prompts reutilizáveis (atalhos de atividade)

Arquivos de prompt prontos:

- `github_prompts_new-module.prompt.md`
- `github_prompts_new-api-route.prompt.md`
- `github_prompts_new-component.prompt.md`
- `github_prompts_generate-migration.prompt.md`
- `github_prompts_generate-pdf-template.prompt.md`
- `github_prompts_ner-training-data.prompt.md`
- `github_prompts_rag-index-document.prompt.md`
- `github_prompts_code-review.prompt.md`
- `github_prompts_compliance-audit.prompt.md`
- `github_prompts_validate-all.prompt_Version2.md`
- `github_prompts_bootstrap-project.prompt_Version2.md`

Use esses prompts quando quiser padronização e velocidade.

---

## 4) Como escrever instruções eficazes na janela do Copilot

Use este formato em 6 blocos:

1. **Objetivo**
2. **Escopo** (arquivos/módulos afetados)
3. **Skills que devem ser aplicadas**
4. **Restrições** (LGPD, ANVISA, padrão técnico)
5. **Critérios de aceite**
6. **Validação esperada** (build/testes)

### Template pronto

```text
Objetivo: [o que precisa ser entregue]
Escopo: [módulos e arquivos]
Skills: [frontend, backend-api, database, testing, security-lgpd...]
Restrições: [TypeScript strict, sem any, RLS, soft-delete, audit_log]
Critérios de aceite: [regras funcionais e técnicas]
Validação: [npm run build, testes X, endpoint Y]
```

---

## 5) Combinações de skills mais úteis (HarmoniFace)

### Novo módulo completo
Skills: Database + Backend/API + Frontend + Testing + Security + Docs

### Endpoint com regra clínica
Skills: Backend/API + Compliance + Security + Testing

### Fluxo de baixa de estoque por sessão
Skills: Inventory + Database + Backend/API + Compliance + Testing

### Relatório financeiro com exportação
Skills: Financial + Backend/API + Frontend + Docs + Testing

### Ajuste em IA clínica
Skills: NLP/NER ou RAG + Compliance + Security + Testing

---

## 6) Exemplos de instruções prontas para uso

### Exemplo A — criar endpoint novo

```text
Objetivo: criar endpoint POST /api/sessions/[id]/finalize
Escopo: src/app/api/sessions/[id]/finalize/route.ts e service relacionado
Skills: backend-api, ai-compliance, security-lgpd, testing
Restrições: autenticação obrigatória, audit_log obrigatório, sem any
Critérios de aceite: calcula compliance score, bloqueia fechamento se score < 50, retorna JSON padronizado
Validação: npm run build e testes de integração do endpoint
```

### Exemplo B — tela nova de dashboard

```text
Objetivo: criar aba de indicadores de estoque no dashboard
Escopo: src/app/(dashboard)/reports/page.tsx e componentes em src/components/dashboard
Skills: frontend, inventory, backend-api, testing
Restrições: usar shadcn/ui, acessibilidade WCAG AA, sem lógica de negócio na UI
Critérios de aceite: exibir low stock, vencidos, vencendo em 30 dias
Validação: npm run build + testes do componente
```

### Exemplo C — migration segura

```text
Objetivo: criar migration para histórico de ajustes manuais de compliance
Escopo: supabase/migrations
Skills: database, security-lgpd, ai-compliance
Restrições: RLS habilitado, índices para consultas por session_id e created_at, rollback comentado
Critérios de aceite: tabela criada com foreign key + políticas de acesso
Validação: aplicar migration sem erro e validar policies no Supabase
```

---

## 7) Erros comuns que reduzem a qualidade

- Pedir “faz tudo” sem contexto de escopo.
- Não informar qual módulo/arquivo deve ser alterado.
- Ignorar requisitos regulatórios (LGPD/ANVISA/CFM).
- Pedir implementação sem critério de aceite.
- Não exigir validação final (build/testes).

---

## 8) Estratégia recomendada para o time

1. Comece com `github_copilot-instructions.md` como base do projeto.
2. Para cada tarefa, cite explicitamente as skills no prompt.
3. Para tarefas recorrentes, use os arquivos em `github_prompts_*.md`.
4. Sempre finalize pedindo validação objetiva (`build`, testes, checklist).
5. Em mudanças críticas, rode também `github_prompts_validate-all.prompt_Version2.md`.

---

## 9) Prompt “meta” (copie e use sempre)

```text
Use o contexto do repositório HarmoniFace e aplique as skills necessárias da pasta .github.
Antes de codar, liste as skills ativadas e a ordem de execução.
Implemente com TypeScript strict, sem any, com foco em LGPD/ANVISA.
No final, rode validação e entregue resumo objetivo com arquivos alterados.
```

---

## 10) Observação importante sobre nomes de arquivo

No seu repositório atual, os arquivos de skill têm prefixo `github_` (ex.: `github_instructions_frontend.instructions.md`).
Ao escrever prompts, prefira mencionar o **nome da skill** (ex.: "aplique skill frontend + backend-api") em vez de depender de caminho exato.

Isso evita falhas quando houver renomeação de arquivo de instruções.
