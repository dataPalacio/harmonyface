---
description: "Prepara e indexa um documento na base de conhecimento do RAG"
---

# Indexar Documento na Base RAG

Processe o documento fornecido para indexação na base de conhecimento do HarmoniFace:

1. **Classificar fonte:** bula | protocolo | artigo | guideline | nota_tecnica
2. **Extrair metadata:** título, autor, data, categoria de procedimento
3. **Chunking:** Dividir em chunks de ~512 tokens com overlap de 50
4. **Preservar contexto:** Manter headers de seção como prefixo de cada chunk
5. **Gerar query de teste:** 3 perguntas que este documento deveria responder

Formato de saída: Array de objetos prontos para inserção na tabela `knowledge_base`.

Referência: `.github/instructions/ai-rag.instructions.md`