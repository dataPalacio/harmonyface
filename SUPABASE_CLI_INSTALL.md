# 🔧 Guia de Instalação - Supabase CLI

## Problema
```
npm error Installing Supabase CLI as a global module is not supported.
npm error Please use one of the supported package managers: https://github.com/supabase/cli#install-the-cli
```

## Solução
O Supabase CLI não aceita instalação via npm. Deve usar um dos gerenciadores suportados.

---

## ✅ Opção 1: Scoop (RECOMENDADO para Windows)

### Vantagens
- ✅ Mais leve
- ✅ Sem necessidade de escalar privilégios (admin)
- ✅ Fácil de desinstalar/atualizar
- ✅ Melhor para desenvolvimento

### Instalação

**Passo 1: Instalar Scoop (se não tiver)**

Abra PowerShell como **usuário normal** (NÃO precisa admin):

```powershell
# Permitir scripts (uma única vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar Scoop
iwr -useb get.scoop.sh | iex

# Aguarde 1-2 minutos
```

**Verificar instalação:**
```powershell
scoop --version
# Esperado: Scoop v0.x.x
```

**Passo 2: Instalar Supabase CLI**

```powershell
scoop install supabase
```

**Esperado:**
```
Installing 'supabase' (x.x.x) ...
...
✓ 'supabase' (x.x.x) was installed successfully!
```

**Passo 3: Verificar instalação**

```powershell
supabase --version
# Esperado: supabase version 1.x.x
```

---

## ✅ Opção 2: Chocolatey

### Vantagens
- ✅ Gerenciador popular no Windows
- ✅ Fácil atualização
- ✅ Muitos pacotes disponíveis

### Desvantagens
- ⚠️ Precisa executar PowerShell como **ADMIN**

### Instalação

**Passo 1: Instalar Chocolatey (se não tiver)**

Abra PowerShell como **ADMINISTRADOR**:

```powershell
# Escalar privilégios (se não estiver como admin)
# (PowerShell → Clique direito → "Executar como administrador")

# Instalar Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; 
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Aguarde até completar
```

**Passo 2: Instalar Supabase CLI**

```powershell
choco install supabase-cli
```

**Passo 3: Verificar**

```powershell
supabase --version
```

---

## ✅ Opção 3: Download Direto (SEM Dependency)

Se preferir não instalar gerenciadores extras:

**Passo 1: Download Binário**

1. Vá para: https://github.com/supabase/cli/releases
2. Procure a versão mais nova
3. Baixe o arquivo para Windows (ex: `supabase_1.xx.x_windows_amd64.zip`)

**Passo 2: Extrair**

```powershell
# Substituir X.xx.x pela versão real
Expand-Archive -Path "C:\Users\gustavo.palacio\Downloads\supabase_1.XX.X_windows_amd64.zip" -DestinationPath "C:\supabase"
```

**Passo 3: Adicionar ao PATH**

```powershell
# Adicionar C:\supabase ao PATH do Windows
# Opção A: Via PowerShell (permanente)
[Environment]::SetEnvironmentVariable(
    "Path",
    $env:Path + ";C:\supabase",
    "User"
)

# Fechar e reabrir PowerShell

# Opção B: Via GUI (manual)
# 1. Tecla Windows → "env"
# 2. Abrir "Editar as variáveis de ambiente do sistema"
# 3. Variáveis de Ambiente → PATH (user)
# 4. Novo → C:\supabase
# 5. OK
```

**Passo 4: Verificar**

```powershell
supabase --version
```

---

## 🚀 Próximos Passos (Após Instalação)

Uma vez instalado o Supabase CLI:

```powershell
# 1. Login na conta Supabase
supabase login

# 2. Navegar para projeto
cd c:\git-clones\harmonyface

# 3. Link ao projeto Supabase
supabase link --project-ref seu-project-ref
# Obter ref em: Supabase Dashboard → Settings → General → Reference ID

# 4. Executar migrations
supabase db push

# ✅ Esperado:
# ✓ Migrating schema out of band
# ✓ Applied migrations:
#   ✓ 202602270001_create_base_schema
#   ✓ 202602270002_phase5_notification_logs
```

---

## 🆘 Troubleshooting

### Erro: "supabase: the term 'supabase' is not recognized"

**Causa:** PATH não atualizado.

**Solução:**
```powershell
# Feche completamente PowerShell (todas abas)
# Reabra PowerShell
# Teste novamente:
supabase --version
```

### Erro: "Access denied" ao instalar Scoop

**Causa:** Política de execução restritiva.

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### Erro: "Permission denied" com Chocolatey

**Causa:** Não está como ADMIN.

**Solução:**
Feche PowerShell e reabra como **Administrador** (clique direito → "Executar como administrador")

### Erro: "Could not find project ref"

**Causa:** Project reference ID incorreto.

**Solução:**
```powershell
# Obter ref correto:
# 1. Acesse: https://supabase.com/dashboard
# 2. Selecione seu projeto
# 3. Settings → General
# 4. Copie "Reference ID" (ex: xxxxxxx)

# Depois:
supabase link --project-ref xxxxxxx
```

---

## 📊 Comparação das Opções

| Aspecto | Scoop | Chocolatey | Download Direto |
|---------|-------|-----------|-----------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Precisa Admin** | ❌ Não | ✅ Sim | ❌ Não |
| **Atualização** | Automática | `choco upgrade` | Manual |
| **Dependências** | Mínimas | Várias | Nenhuma |
| **Recomendado** | ✅ SIM | ⚠️ Se Chocolatey já tiver | Se não quiser CLI |

---

## ✅ Minha Recomendação

**Para 99% dos casos (especialmente iniciantes):**

### Use **Scoop** 🎯

```powershell
# 1. Permitir scripts (uma vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 2. Instalar Scoop
iwr -useb get.scoop.sh | iex

# 3. Instalar Supabase
scoop install supabase

# 4. Verificar
supabase --version

# 5. Continuar com migrations
cd c:\git-clones\harmonyface
supabase login
supabase link --project-ref SEU-ID
supabase db push
```

**Tempo total:** ~3-5 minutos ⚡

---

## Referências

- **Supabase CLI Docs:** https://supabase.com/docs/guides/cli
- **Scoop Home:** https://scoop.sh
- **Chocolatey Home:** https://chocolatey.org
- **GitHub CLI Releases:** https://github.com/supabase/cli/releases

---

**Última atualização:** 27 de fevereiro de 2026  
**Status:** ✅ Guia completo de instalação
