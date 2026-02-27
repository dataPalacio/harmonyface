---
description: "Realiza code review focado em qualidade, segurança e padrões do projeto"
---

# Code Review — HarmoniFace

Revise o código fornecido verificando:

## Checklist
- [ ] **TypeScript:** Sem `any`, tipos explícitos, interfaces documentadas
- [ ] **Segurança:** Sem dados sensíveis expostos, inputs validados, auth verificada
- [ ] **LGPD:** Dados de paciente mascarados em logs, soft-delete, consentimento
- [ ] **Performance:** Sem N+1 queries, paginação presente, memos quando necessário
- [ ] **Padrão:** Segue convenções do `.github/copilot-instructions.md`
- [ ] **Testes:** Lógica crítica tem teste correspondente
- [ ] **Acessibilidade:** Labels, aria-*, contraste (se componente UI)
- [ ] **Compliance:** Lote registrado, validade verificada, audit_log presente
- [ ] **Error handling:** Try-catch, mensagens úteis, sem stack trace exposto
- [ ] **Documentação:** JSDoc em funções públicas, comentários em lógica complexa

Formato de saída:
- 🔴 **Crítico:** Deve ser corrigido antes do merge
- 🟡 **Sugestão:** Melhoria recomendada
- 🟢 **Positivo:** Destaque de boa prática encontrada