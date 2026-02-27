---
description: "Gera template de documento PDF (orçamento, recibo, termo de consentimento)"
---

# Gerar Template PDF: {tipo_documento}

Crie um template de PDF para **{tipo_documento}** usando React-PDF.

Elementos obrigatórios:
- **Header:** Logo do consultório + nome da profissional + CRM/registro
- **Dados do paciente:** Nome, CPF (mascarado: ***.***.XXX-XX)
- **Corpo:** Específico por tipo de documento
- **Footer:** Data + local + espaço para assinatura + termos legais
- **Estilo:** Profissional, paleta do projeto, fontes legíveis

Tipos disponíveis:
- `consent` — Termo de consentimento livre e esclarecido
- `estimate` — Orçamento de procedimentos
- `invoice` — Fatura
- `receipt` — Recibo de pagamento
- `clinical_report` — Relatório clínico do paciente

Referência: `.github/instructions/financial.instructions.md`