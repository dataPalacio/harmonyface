---
description: "Cria a estrutura completa de um novo módulo do HarmoniFace"
---

# Criar Novo Módulo: {nome_do_modulo}

Crie a estrutura completa para o módulo **{nome_do_modulo}** seguindo o padrão
do projeto HarmoniFace:

## Checklist de Arquivos a Criar

1. **Types:** `src/types/{modulo}.ts`
   - Interface principal da entidade
   - Interface de criação (Create)
   - Interface de atualização (Update)
   - Interface de listagem com filtros

2. **Validations:** `src/lib/validations/{modulo}.ts`
   - Zod schemas para Create, Update e filtros de busca

3. **Service:** `src/lib/services/{modulo}-service.ts`
   - Classe com métodos: `create`, `getById`, `list`, `update`, `delete`
   - Injeção do Supabase client via construtor
   - Chamada ao audit_log em toda operação de escrita

4. **API Routes:** `src/app/api/{modulo}/route.ts` e `src/app/api/{modulo}/[id]/route.ts`
   - GET (list), POST (create) na route base
   - GET (byId), PUT (update), DELETE (soft-delete) na route [id]

5. **Componentes:**
   - `src/components/{modulo}/{modulo}-list.tsx` — Tabela/lista com filtros
   - `src/components/{modulo}/{modulo}-form.tsx` — Formulário de criação/edição
   - `src/components/{modulo}/{modulo}-detail.tsx` — Visualização detalhada
   - `src/components/{modulo}/{modulo}-card.tsx` — Card para dashboards

6. **Página:** `src/app/(dashboard)/{modulo}/page.tsx`

7. **Testes:** `src/lib/services/__tests__/{modulo}-service.test.ts`

Siga as convenções definidas em `.github/copilot-instructions.md`.