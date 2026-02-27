---
description: "Inicializa o projeto HarmoniFace do zero com toda a fundação"
---

# 🚀 Bootstrap — HarmoniFace

Execute a inicialização completa do projeto seguindo esta sequência rigorosa:

## Fase 0 — Infraestrutura
1. Criar projeto Next.js 14+ com App Router e TypeScript strict
2. Instalar dependências: tailwindcss, @shadcn/ui, @supabase/supabase-js, @supabase/ssr, zod, react-hook-form, @hookform/resolvers, recharts, @fullcalendar/react, lucide-react
3. Configurar Tailwind com tema customizado (azul-petróleo #0F4C5C)
4. Configurar ESLint + Prettier
5. Criar `.env.local.example` com variáveis do Supabase
6. Configurar Supabase client (server + browser)
7. Configurar middleware de autenticação

## Fase 1 — Banco de Dados
8. Criar função utilitária `update_updated_at_column()`
9. Migration: tabela `patients` com soft-delete
10. Migration: tabela `anamnesis`
11. Migration: tabela `procedure_catalog` + seed data
12. Migration: tabela `appointments`
13. Migration: tabela `sessions`
14. Migration: tabela `session_procedures`
15. Migration: tabela `inventory` + `inventory_movements`
16. Migration: tabela `financial_records`
17. Migration: tabela `document_templates`
18. Migration: tabela `audit_log`
19. Migration: tabela `knowledge_base` com pgvector
20. RLS + policies em todas as tabelas
21. Seed: procedimentos padrão de harmonização facial

## Fase 2 — Types e Validations
22. Criar todas as interfaces TypeScript em `src/types/`
23. Criar todos os Zod schemas em `src/lib/validations/`

## Fase 3 — Layout Base
24. Criar layout principal com sidebar + topbar
25. Criar navegação com rotas de todos os módulos
26. Criar página de login (Supabase Auth)
27. Criar dashboard placeholder com cards de KPI

**Ao concluir cada fase, gerar commit semântico e atualizar CHANGELOG.md**

Referência de arquitetura: `.github/copilot-instructions.md`
Referência de schema: Seção "Modelo de Dados" do prompt original do projeto