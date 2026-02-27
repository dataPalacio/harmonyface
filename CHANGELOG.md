# Changelog

## [0.1.0] - 2026-02-27

### Added
- Fundação do projeto com Next.js 14 + TypeScript strict + Tailwind.
- Estrutura de rotas App Router para módulos do CRM.
- Endpoints API iniciais para pacientes, agenda, sessões, estoque, financeiro, relatórios e IA.
- Setup Supabase com migration inicial e seed do catálogo de procedimentos.
- Estrutura base de serviço de IA local (FastAPI) para NER/RAG.

### Changed
- Implementada Fase 1: autenticação Supabase real (login/logout + middleware).
- CRUD completo de pacientes com integração ao Supabase (UI + API autenticada).
- CRUD de anamnese por paciente com persistência real (UI + API autenticada).
- Políticas RLS e constraint de unicidade em `anamnesis.patient_id`.
- Implementada Fase 2 operacional: agenda FullCalendar, sessões, fotos clínicas e termo digital.
- Nova migration com tabelas `clinical_photos` e `consents`, RLS e buckets de storage.
- APIs REST para agendamentos, sessões, fotos e consentimento por paciente.
