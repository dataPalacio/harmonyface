---
description: "Executa validação completa do projeto contra todos os padrões e requisitos"
---

# 🔍 Validação Global — HarmoniFace

Execute uma varredura completa do projeto verificando TODOS os critérios abaixo.
Reporte como relatório com status ✅ / ⚠️ / ❌ para cada item.

## 1. Arquitetura
- [ ] Todo módulo segue pattern: types → validations → services → api → components
- [ ] Nenhuma lógica de negócio em componentes ou API routes
- [ ] Imports organizados conforme convenção

## 2. TypeScript
- [ ] Zero uso de `any` sem justificativa
- [ ] Todas as funções públicas com JSDoc
- [ ] Interfaces explícitas para props de componentes

## 3. Banco de Dados
- [ ] Todas as tabelas com RLS habilitado
- [ ] Todas as tabelas com `created_at` e `updated_at`
- [ ] Tabelas de paciente com `deleted_at` (soft-delete)
- [ ] Migrations com seção ROLLBACK comentada
- [ ] Índices em colunas de busca frequente

## 4. Segurança / LGPD
- [ ] Auth verificado em todos os endpoints
- [ ] Nenhum dado sensível em logs
- [ ] Fotos em bucket privado com signed URLs
- [ ] Soft-delete implementado (nunca delete físico)
- [ ] Validação de input com Zod em todos os endpoints

## 5. Compliance Clínico
- [ ] Lote obrigatório em session_procedures
- [ ] Validade verificada antes de usar produto
- [ ] Consentimento vinculado a sessões
- [ ] Compliance checker com score implementado
- [ ] Disclaimer em todas as respostas de IA

## 6. Estoque
- [ ] Baixa automática ao registrar procedimento
- [ ] FIFO implementado
- [ ] Bloqueio de produtos vencidos
- [ ] Alertas de estoque mínimo

## 7. Testes
- [ ] Cobertura ≥ 75% global
- [ ] Compliance checker testado
- [ ] Cálculos financeiros testados
- [ ] Pipeline NER testado com exemplos conhecidos
- [ ] Validações de CPF/datas testadas

## 8. UI/UX
- [ ] Responsivo em mobile/tablet
- [ ] Loading skeletons em carregamentos
- [ ] Empty states em listas vazias
- [ ] Error boundaries implementados
- [ ] Acessibilidade WCAG AA

Formato de saída: Relatório markdown com percentual de conformidade por categoria.