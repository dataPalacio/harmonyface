# HarmoniFace CRM

CRM web para consultório de harmonização facial com camada de IA clínica e foco em MVP solo, baseado na arquitetura **OPÇÃO A (Full Gratuita / Low-Cost)**.

## Stack (OPÇÃO A)

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend/API**: Next.js Route Handlers
- **Banco**: Supabase PostgreSQL + pgvector
- **Auth/Storage**: Supabase Auth + Storage
- **IA (base inicial)**: Pipeline local para NER/RAG + serviço FastAPI opcional

## Estrutura principal

- `src/app`: rotas de autenticação, dashboard e APIs
- `src/components`: componentes por módulo
- `src/lib`: Supabase, serviços de domínio e IA
- `src/types`: tipos TypeScript do domínio
- `supabase/migrations`: schema SQL inicial
- `supabase/seed.sql`: catálogo inicial e templates
- `ai-service`: serviço Python local para NER/RAG
- `docs/knowledge-base`: documentos para indexação RAG

## Como rodar

1. Instale Node.js 20+.
2. Instale dependências:
	- `npm install`
3. Configure variáveis:
	- copie `.env.example` para `.env.local`
	- preencha credenciais Supabase
4. Rode em dev:
	- `npm run dev`

## Banco de dados (Supabase)

1. Execute a migration `supabase/migrations/202602270001_init_harmoniface.sql`.
2. Execute a migration `supabase/migrations/202602270002_phase1_auth_rls.sql`.
3. Execute a migration `supabase/migrations/202602270003_phase2_operational.sql`.
4. Execute o seed `supabase/seed.sql`.
5. Verifique se as extensões `pgcrypto` e `vector` estão habilitadas.

## Fase 1 implementada

- Autenticação real via Supabase Auth (`/login`) com login por email/senha
- Middleware de proteção de rotas do dashboard
- Logout com invalidação de sessão
- CRUD de pacientes:
	- UI: listagem, criação, edição e exclusão
	- API: `GET/POST /api/patients`, `GET/PATCH/DELETE /api/patients/[id]`
- CRUD de anamnese:
	- UI: formulário por paciente
	- API: `GET/PUT /api/patients/[id]/anamnesis`
- APIs protegidas por sessão autenticada

## Criar usuário de acesso

No painel Supabase:
1. Acesse `Authentication > Users`.
2. Crie um usuário com email/senha para a profissional.
3. Use essas credenciais na tela de login.

## Teste ponta a ponta

1. `npm install`
2. `npm run dev`
3. Acesse `/login` e autentique com usuário do Supabase.
4. Acesse `/patients` e crie um paciente.
5. Abra o detalhe do paciente e edite os dados.
6. Acesse `Anamnese` e salve informações clínicas.
7. Valide os endpoints em `/api/patients` e `/api/patients/[id]/anamnesis` com sessão ativa.

## Fases implementadas no scaffold

- ✅ Fundação do projeto (estrutura, config e módulos iniciais)
- ✅ Fase 1: autenticação real + CRUD pacientes/anamnese + integração banco ponta a ponta
- ✅ Fase 2: agenda FullCalendar + registro de sessões + upload/galeria de fotos + consentimento digital
- ✅ Base de schema para sessões, agenda, estoque, financeiro e knowledge base
- ✅ Endpoints iniciais de IA (`ner`, `rag`, `summarize`, `compliance`)

## Fase 2 implementada

- Módulo de agendamento com FullCalendar e criação de agendamentos/bloqueios.
- Registro de sessões clínicas com dados de procedimento e anotações livres.
- Upload de fotos clínicas em bucket Supabase Storage com metadados e timeline por paciente.
- Termo de consentimento digital com assinatura eletrônica por nome e documento HTML gerado.

## Próximos passos sugeridos

- Fase 3: financeiro (orçamentos, recibos e pagamentos) com geração de PDFs.
- Fase 3: estoque com baixa automática por sessão e alertas de validade/estoque mínimo.
- Evoluir pipeline NER/RAG para produção com dataset anotado e indexação vetorial real.