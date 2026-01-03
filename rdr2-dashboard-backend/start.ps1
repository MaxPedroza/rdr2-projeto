#!/usr/bin/env pwsh
# Script para iniciar o servidor RDR2 Tracker com diretório correto

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "📍 Diretório do script: $scriptDir"

# Navegar para o diretório do backend
Set-Location $scriptDir
Write-Host "📂 Mudando para: $(Get-Location)"

# Verificar se node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..."
    npm install
}

# Verificar se Banco existe
if (-Not (Test-Path "../Banco")) {
    Write-Host "❌ Erro: Diretório ../Banco não encontrado!"
    exit 1
}

Write-Host "✅ Tudo pronto!"
Write-Host ""
Write-Host "🎮 Iniciando servidor..."
node server.js
