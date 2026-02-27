---
description: "Gera migration SQL para o Supabase seguindo padrões do projeto"
---

# Gerar Migration: {descricao}

Crie uma migration SQL para: **{descricao}**

A migration deve incluir:
1. `CREATE TABLE` ou `ALTER TABLE` conforme necessário
2. Colunas `created_at` e `updated_at` com triggers
3. Soft-delete (`deleted_at`) para entidades de paciente
4. Row Level Security (RLS) habilitado com policy para `authenticated`
5. Índices para colunas de busca frequente
6. Documentação da estrutura JSONB em comentários
7. Seção `-- ROLLBACK:` comentada no final

Referência: `.github/instructions/database.instructions.md`