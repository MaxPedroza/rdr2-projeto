# 🎉 Deploy GitHub + Render - Status Atual

## ✅ O que foi feito

### 1. **GitHub Actions Workflows** ✓
- Criados 2 workflows automáticos:
  - `deploy.yml` - Build e deploy automático
  - `tests.yml` - Rodar testes e validações
- Workflows já no repositório: https://github.com/MaxPedroza/rdr2-projeto

### 2. **Configurações de Produção** ✓
- Backend atualizado com CORS para Render
- Frontend configura API URL automaticamente (localhost vs produção)
- `.env.example` atualizado com todas as variáveis

### 3. **Tudo enviado para GitHub** ✓
- 2 commits realizados com sucesso
- Workflows prontos para disparar

---

## 📋 Próximas Ações (MANUAL)

### Passo 1: Criar conta no Render (5 min)
1. Vá em https://render.com
2. Clique "Sign up"
3. Use GitHub para autenticação

### Passo 2: Deployar o Backend (10 min)
1. Dashboard → New + → Web Service
2. Selecione `rdr2-projeto` repository
3. Preencha:
   - **Name:** `rdr2-backend`
   - **Build Command:** `cd rdr2-dashboard-backend && npm install`
   - **Start Command:** `cd rdr2-dashboard-backend && npm start`
4. Environment Variables:
   ```
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://rdr2-frontend.onrender.com
   ```
5. Create Web Service
6. **Copie a URL** (ex: `https://rdr2-backend.onrender.com`)

### Passo 3: Deployar o Frontend (10 min)
1. Dashboard → New + → Static Site
2. Selecione `rdr2-projeto` repository
3. Preencha:
   - **Name:** `rdr2-frontend`
   - **Build Command:** `cd rdr2-frontend && npm install && npm run build`
   - **Publish Directory:** `rdr2-frontend/dist/rdr2-frontend/browser`
4. Create Static Site
5. **Copie a URL** (ex: `https://rdr2-frontend.onrender.com`)

### Passo 4: Obter Webhooks no Render (5 min)
1. Cada serviço criado tem um **Deploy Hook**
2. Settings → Deploy Hook
3. Copie as 2 URLs

### Passo 5: Adicionar Secrets no GitHub (5 min)
1. GitHub → seu repo → Settings
2. Secrets and variables → Actions
3. Adicione 2 secrets:
   ```
   RENDER_BACKEND_WEBHOOK = [URL do webhook do backend]
   RENDER_DEPLOY_WEBHOOK = [URL do webhook do frontend]
   ```

---

## 🧪 Testar Deploy Automático

Depois de completar os passos acima:

```bash
# Fazer uma pequena mudança
echo "# Auto Deploy Test" >> DEPLOY-TEST.md

# Commit e Push
git add DEPLOY-TEST.md
git commit -m "Test auto-deploy"
git push origin main
```

Resultado esperado:
- ✅ GitHub Actions workflow dispara
- ✅ Render recebe webhook
- ✅ App atualizado em produção em 2-3 min

---

## 📊 Arquitetura Final

```
GitHub (código)
    ↓
GitHub Actions (CI/CD)
    ↓
Webhook → Render
    ↓
Frontend: https://rdr2-frontend.onrender.com
Backend:  https://rdr2-backend.onrender.com
```

---

## 📚 Documentação Completa

Para instruções passo-a-passo detalhadas, veja:
→ [DEPLOY-RENDER-GITHUB.md](./DEPLOY-RENDER-GITHUB.md)

---

## 💡 Resumo do que acontece AUTOMATICAMENTE

Cada vez que você faz `git push`:

1. **GitHub Actions** roda automaticamente
2. Executa build do frontend e backend
3. Se tudo OK, envia webhook para Render
4. **Render** detecta webhook e faz novo deploy
5. App é atualizado em produção em minutos

Sem fazer nada manual! 🚀

---

## ❓ Dúvidas?

- Verifique os logs em: GitHub → Actions (tab)
- Logs detalhados em: Render → seu serviço → Logs
- Troubleshooting: [DEPLOY-RENDER-GITHUB.md](./DEPLOY-RENDER-GITHUB.md)
