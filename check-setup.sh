#!/bin/bash
# Verificação pré-GitHub do projeto RDR2

echo "🔍 Verificando configuração do projeto..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# 1. Verificar .gitignore
echo -n "✓ Verificando .gitignore... "
if [ -f ".gitignore" ]; then
  if grep -q "node_modules" .gitignore && grep -q ".env" .gitignore; then
    echo -e "${GREEN}OK${NC}"
  else
    echo -e "${RED}ERRO: .gitignore não contém node_modules ou .env${NC}"
    errors=$((errors + 1))
  fi
else
  echo -e "${RED}ERRO: .gitignore não encontrado${NC}"
  errors=$((errors + 1))
fi

# 2. Verificar .env.example
echo -n "✓ Verificando .env.example... "
if [ -f ".env.example" ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}ERRO: .env.example não encontrado${NC}"
  errors=$((errors + 1))
fi

# 3. Verificar README.md
echo -n "✓ Verificando README.md... "
if [ -f "README.md" ]; then
  if grep -q "Como Rodar" README.md || grep -q "Setup" README.md; then
    echo -e "${GREEN}OK${NC}"
  else
    echo -e "${YELLOW}AVISO: README.md encontrado mas pode estar incompleto${NC}"
  fi
else
  echo -e "${RED}ERRO: README.md não encontrado${NC}"
  errors=$((errors + 1))
fi

# 4. Verificar se .env REAL não existe
echo -n "✓ Verificando se .env real está oculto... "
if [ ! -f ".env" ] && [ ! -f "rdr2-dashboard-backend/.env" ]; then
  echo -e "${GREEN}OK (arquivo .env não encontrado - bom!)${NC}"
else
  echo -e "${RED}ERRO: Arquivo .env encontrado! Remova antes de fazer commit!${NC}"
  errors=$((errors + 1))
fi

# 5. Verificar structure
echo -n "✓ Verificando estrutura de pastas... "
if [ -d "rdr2-dashboard-backend" ] && [ -d "rdr2-frontend" ] && [ -d "Banco" ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}ERRO: Faltam pastas obrigatórias${NC}"
  errors=$((errors + 1))
fi

# 6. Verificar server.js
echo -n "✓ Verificando server.js... "
if [ -f "rdr2-dashboard-backend/server.js" ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}ERRO: server.js não encontrado${NC}"
  errors=$((errors + 1))
fi

echo ""
echo "=========================================="
if [ $errors -eq 0 ]; then
  echo -e "${GREEN}✅ Tudo verificado! Pronto para GitHub${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. git add ."
  echo "2. git commit -m 'Initial commit: v1.0 with MongoDB'"
  echo "3. git push origin main"
else
  echo -e "${RED}❌ $errors erro(s) encontrado(s). Corrija antes de fazer commit.${NC}"
fi
echo "=========================================="
