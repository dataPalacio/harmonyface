---
description: "Cria uma nova API route seguindo o padrão do HarmoniFace"
---

# Criar API Route: {metodo} /api/{path}

Crie uma API route seguindo o padrão do projeto:

- Use `createClient()` de `@/lib/supabase/server`
- Valide input com Zod schema
- Delegue lógica para o Service correspondente
- Retorne no formato padrão: `{ data: ... }` ou `{ error: ..., code: ... }`
- Trate erros: ZodError → 400, NotFound → 404, genérico → 500
- Gere entrada no audit_log para operações de escrita
- Verifique autenticação no início

Referência de padrão: `.github/instructions/backend-api.instructions.md`