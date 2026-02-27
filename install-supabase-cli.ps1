# Automate Supabase CLI Install for Windows
# Este script instala Scoop + Supabase CLI automaticamente

# =====================================================
# OPÇÃO 1: Instalar via Scoop (RECOMENDADO)
# =====================================================

Write-Host "🔧 HarmoniFace - Supabase CLI Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como admin (NÃO é necessário para Scoop)
if ($PSVersionTable.Platform -eq "Win32NT") {
    Write-Host "✅ Rodando no Windows PowerShell" -ForegroundColor Green
} else {
    Write-Host "⚠️  Recomendado rodar no Windows PowerShell (não WSL)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Verificando Scoop..." -ForegroundColor Yellow

# Verificar se Scoop está instalado
if (Get-Command scoop -ErrorAction SilentlyContinue) {
    Write-Host "✅ Scoop já está instalado" -ForegroundColor Green
    $scoop_version = scoop --version
    Write-Host "   Versão: $scoop_version" -ForegroundColor Green
} else {
    Write-Host "📥 Instalando Scoop (primeira execução)..." -ForegroundColor Cyan
    
    # Permitir scripts
    Write-Host "   Ajustando política de execução..." -ForegroundColor Gray
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force | Out-Null
    
    # Instalar Scoop
    Write-Host "   Baixando e instalando Scoop..." -ForegroundColor Gray
    iwr -useb get.scoop.sh | iex
    
    if (Get-Command scoop -ErrorAction SilentlyContinue) {
        Write-Host "✅ Scoop instalado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar Scoop" -ForegroundColor Red
        Write-Host "   Manual: https://scoop.sh" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "🔍 Verificando Supabase CLI..." -ForegroundColor Yellow

# Verificar se Supabase CLI está instalado
if (Get-Command supabase -ErrorAction SilentlyContinue) {
    Write-Host "✅ Supabase CLI já está instalado" -ForegroundColor Green
    $supabase_version = supabase --version
    Write-Host "   Versão: $supabase_version" -ForegroundColor Green
} else {
    Write-Host "📥 Instalando Supabase CLI..." -ForegroundColor Cyan
    
    $scoop_install = scoop install supabase 2>&1
    
    if (Get-Command supabase -ErrorAction SilentlyContinue) {
        Write-Host "✅ Supabase CLI instalado com sucesso!" -ForegroundColor Green
        $supabase_version = supabase --version
        Write-Host "   Versão: $supabase_version" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar Supabase CLI" -ForegroundColor Red
        Write-Host "   Tente manualmente: scoop install supabase" -ForegroundColor Yellow
        Write-Host "   Ou veja SUPABASE_CLI_INSTALL.md para outras opções" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "🔐 Próximo: Login no Supabase" -ForegroundColor Yellow
Write-Host ""
Write-Host "Execute os comandos abaixo:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # Fazer login" -ForegroundColor Gray
Write-Host "  supabase login" -ForegroundColor White
Write-Host ""
Write-Host "  # Linkar ao projeto (com seu project ref)" -ForegroundColor Gray
Write-Host "  supabase link --project-ref seu-project-ref" -ForegroundColor White
Write-Host ""
Write-Host "  # Executar migrations" -ForegroundColor Gray
Write-Host "  supabase db push" -ForegroundColor White
Write-Host ""
Write-Host "✅ Setup completo!" -ForegroundColor Green
