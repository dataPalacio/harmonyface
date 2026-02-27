# HarmoniFace — Instruções para Coding Agents

## Contexto
Este é um CRM web para consultórios de harmonização facial.
Stack: Next.js 14+ · TypeScript · Supabase · shadcn/ui · IA (NER/RAG).

## Antes de Qualquer Alteração
1. Leia `.github/copilot-instructions.md` (orquestrador mestre)
2. Identifique quais módulos são afetados pela mudança
3. Consulte os `.github/instructions/*.instructions.md` relevantes
4. Verifique o mapa de dependência entre módulos

## Ordem de Implementação
Sempre siga: Schema → Types → Validations → Service → API → Components → Page → Tests → Docs

## Regras Invioláveis
- TypeScript strict, zero `any`
- RLS em toda tabela Supabase
- Soft-delete para dados de paciente
- Audit log em toda operação de escrita
- Lote obrigatório em procedimentos
- Disclaimer em toda resposta de IA
- Commits semânticos

## Estrutura de Pastas
```
src/app/(dashboard)/{modulo}/    → Páginas
src/app/api/{modulo}/            → API Routes
src/components/{modulo}/         → Componentes
src/lib/services/                → Services (lógica)
src/lib/validations/             → Zod schemas
src/lib/ai/                      → Pipelines de IA
src/types/                       → Interfaces TypeScript
supabase/migrations/             → SQL migrations
```

## Ao Criar Pull Request
- Título com prefixo semântico: `feat:`, `fix:`, etc.
- Descrição com: O que mudou · Por quê · Como testar
- Checklist de entrega do orquestrador mestre aplicado
- Screenshots se houver mudança visual