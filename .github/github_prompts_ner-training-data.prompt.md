---
description: "Gera exemplos de anotações clínicas anotadas para treino do modelo NER"
---

# Gerar Dados de Treino NER — Harmonização Facial

Gere {quantidade} exemplos de anotações clínicas realistas em português brasileiro
para treino do modelo NER de harmonização facial.

Cada exemplo deve conter:
1. **Texto livre** (como a profissional digitaria)
2. **Entidades anotadas** com labels: PROCEDIMENTO, REGIAO_FACIAL, PRODUTO, LOTE,
   QUANTIDADE, TECNICA, INTERCORRENCIA, RETORNO, QUEIXA, SUGESTAO

Variações que devem aparecer:
- Diferentes procedimentos (toxina, preenchimento, bioestimulador, fios, peeling)
- Diferentes regiões faciais
- Com e sem intercorrências
- Com e sem sugestões para próxima sessão
- Linguagem informal vs. técnica
- Abreviações comuns (BTX, AH, HA, UI, mL)
- Sessões simples (1 procedimento) e complexas (múltiplos)

Formato de saída: JSON com `text` e `entities[]` contendo `start`, `end`, `label`, `text`.

Referência: `.github/instructions/ai-nlp-ner.instructions.md`