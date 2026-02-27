---
description: "Audita o código/módulo contra requisitos de compliance LGPD/ANVISA/CFM"
---

# Auditoria de Compliance — HarmoniFace

Realize uma auditoria completa do módulo/código fornecido contra os seguintes frameworks:

## LGPD (Lei 13.709/2018)
- [ ] Dados pessoais identificados e classificados
- [ ] Base legal definida para cada tipo de dado
- [ ] Consentimento coletado e registrado
- [ ] Soft-delete implementado (não delete físico)
- [ ] Direito de acesso implementado (exportação)
- [ ] Dados criptografados em repouso e trânsito
- [ ] Minimização de dados (coleta apenas necessários)

## ANVISA
- [ ] Rastreabilidade de lote em todo procedimento
- [ ] Controle de validade de produtos
- [ ] Registro de intercorrências/eventos adversos
- [ ] Bloqueio automático de produtos vencidos

## CFM (Conselho Federal de Medicina)
- [ ] Prontuário com campos mínimos obrigatórios
- [ ] Retenção de prontuário por 20 anos
- [ ] Termo de consentimento livre e esclarecido
- [ ] Sigilo profissional preservado no sistema

Formato: Relatório com status ✅/❌ e recomendações para cada item.