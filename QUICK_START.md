# 🚀 Quick Start - HarmoniFace Setup (TL;DR)

## Passo 1️⃣: Instalar Supabase CLI (2 min)

```powershell
cd c:\git-clones\harmonyface
.\\install-supabase-cli.ps1
```

**Ou manual (se script não rodar):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
iwr -useb get.scoop.sh | iex
scoop install supabase
```

---

## Passo 2️⃣: Variáveis de Ambiente (2 min)

Criar arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
ADMIN_EMAIL=admin@harmoniface.com
```

**Como obter chaves:**
1. Abra: https://supabase.com → Dashboard → Seu Projeto
2. Settings → API
3. Copie as URLs e chaves

---

## Passo 3️⃣: Instalar Dependências (3 min)

```powershell
cd c:\git-clones\harmoniface
npm install
```

---

## Passo 4️⃣: Criar Schema no Banco (5 min)

```powershell
supabase login
supabase link --project-ref seu-project-ref
supabase db push
```

**Esperado:**
```
✓ Migrating schema out of band
✓ Applied migrations:
✓ 202602270001_create_base_schema
✓ 202602270002_phase5_notification_logs
```

---

## Passo 5️⃣: Iniciar Desenvolvimento (2 min)

```powershell
npm run dev
```

Acesse: **http://localhost:3000/reports**

---

## ✅ Pronto!

Dashboard deve estar rodando. ✨

---

## 🆘 Se Algo Deu Errado

| Problema | Solução |
|----------|---------|
| npm CLI install falhou | Ver: [SUPABASE_CLI_INSTALL.md](SUPABASE_CLI_INSTALL.md) |
| Migration error | Ver: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) |
| Dashboard não carrega | Ver: [SETUP_AND_VALIDATION.md](SETUP_AND_VALIDATION.md) |
| Falta variável env | Checar `.env.local` |
| Port 3000 em uso | `npm run dev -- -p 3001` |

---

## 📚 Documentação Completa

- **Setup Completo:** [SETUP_AND_VALIDATION.md](SETUP_AND_VALIDATION.md)
- **Migrations:** [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **CLI Install:** [SUPABASE_CLI_INSTALL.md](SUPABASE_CLI_INSTALL.md)
- **Deploy:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Tests:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Performance:** [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md)

---

**Total:** ~13-15 minutos ⚡

Pronto para validar e testar! 🎯
