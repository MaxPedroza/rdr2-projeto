#!/bin/bash
# ============================================
# CHECKLIST PRÉ-DEPLOY VERIFICAÇÃO
# ============================================

echo "🔍 Verificando configuração do deploy..."
echo ""

# Verificar Git
echo "✓ Repositório Git:"
git remote -v | grep origin

# Verificar workflows
echo ""
echo "✓ GitHub Actions Workflows:"
ls -la .github/workflows/

# Verificar package.json
echo ""
echo "✓ Backend dependencies:"
cd rdr2-dashboard-backend
npm list --depth=0 | grep -E "cors|express|dotenv"
cd ..

echo ""
echo "✓ Frontend dependencies:"
cd rdr2-frontend
npm list --depth=0 | grep -E "@angular|rxjs"
cd ..

# Verificar arquivos críticos
echo ""
echo "✓ Arquivos de configuração:"
test -f ".env.example" && echo "  ✓ .env.example"
test -f "rdr2-dashboard-backend/server.js" && echo "  ✓ server.js"
test -f "rdr2-frontend/src/app/services/database.ts" && echo "  ✓ database.ts"
test -f ".github/workflows/deploy.yml" && echo "  ✓ deploy.yml"
test -f ".github/workflows/tests.yml" && echo "  ✓ tests.yml"
test -f "DEPLOY-RENDER-GITHUB.md" && echo "  ✓ DEPLOY-RENDER-GITHUB.md"
test -f "DEPLOY-QUICK-START.md" && echo "  ✓ DEPLOY-QUICK-START.md"

echo ""
echo "✅ Tudo verificado!"
echo ""
echo "Próximo passo: Siga as instruções em DEPLOY-QUICK-START.md"
