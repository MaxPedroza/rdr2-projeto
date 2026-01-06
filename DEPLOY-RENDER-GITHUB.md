# 🚀 Guia Deploy RDR2 com GitHub + Render

## ✅ Status
- ✅ Workflows GitHub Actions criados
- ✅ Código enviado para GitHub
- 🔄 **Próximo: Configurar Render + Secrets**

---

## 📋 Passo 1: Criar conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Sign up"**
3. Use GitHub para autenticação (mais fácil)
4. Autorize o acesso ao GitHub

---

## 🎯 Passo 2: Deploy do Backend

### 2.1 Criar novo serviço

1. No Dashboard do Render, clique **"New +"** → **"Web Service"**
2. Conecte seu repositório do GitHub (`MaxPedroza/rdr2-projeto`)
3. Preencha os dados:
   - **Name:** `rdr2-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd rdr2-dashboard-backend && npm install`
   - **Start Command:** `cd rdr2-dashboard-backend && npm start`
   - **Instance Type:** Free (gratuito)

### 2.2 Adicionar variáveis de ambiente

4. Vá em **"Environment"**
5. Clique **"Add Environment Variable"** e adicione:

```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/rdr2_tracker_db?retryWrites=true&w=majority
```

⚠️ **Substitua com suas credenciais reais do MongoDB Atlas!**

### 2.3 Deploy automático

6. Certifique-se que **"Auto-Deploy"** está ativado
7. Clique **"Create Web Service"**
8. Aguarde o build completar (pode levar 2-3 minutos)
9. **Copie a URL** que aparece no topo (exemplo: `https://rdr2-backend.onrender.com`)

---

## 🎯 Passo 3: Deploy do Frontend

### 3.1 Criar novo serviço

1. Clique novamente **"New +"** → **"Static Site"**
2. Conecte o mesmo repositório
3. Preencha os dados:
   - **Name:** `rdr2-frontend`
   - **Build Command:** `cd rdr2-frontend && npm install && npm run build`
   - **Publish Directory:** `rdr2-frontend/dist/rdr2-frontend/browser`
   - **Instance Type:** Free

### 3.2 Deploy automático

4. Certifique-se que **"Auto-Deploy"** está ativado
5. Clique **"Create Static Site"**
6. Aguarde o build (pode levar 3-5 minutos)
7. **Copie a URL** (exemplo: `https://rdr2-frontend.onrender.com`)

---

## 🔐 Passo 4: Obter Webhooks de Deploy

### 4.1 Webhook do Backend

1. No Render, vá ao serviço **"rdr2-backend"**
2. Settings → **"Deploy Hook"**
3. Copie a URL do webhook (exemplo: `https://api.render.com/deploy/srv-...`)

### 4.2 Webhook do Frontend

1. No Render, vá ao serviço **"rdr2-frontend"**
2. Settings → **"Deploy Hook"** (ou equivalent para Static Site)
3. Copie a URL do webhook

---

## 🔑 Passo 5: Adicionar Secrets no GitHub

1. Vá ao repositório no GitHub: `https://github.com/MaxPedroza/rdr2-projeto`
2. Clique em **Settings** (⚙️ no topo)
3. Sidebar esquerda: **"Secrets and variables"** → **"Actions"**
4. Clique **"New repository secret"**

### 5.1 Adicionar Secrets

Crie os seguintes secrets:

| Secret Name | Value |
|---|---|
| `RENDER_BACKEND_WEBHOOK` | Cole a URL do webhook do backend |
| `RENDER_DEPLOY_WEBHOOK` | Cole a URL do webhook do frontend |
| `MONGODB_URI` | Sua URL de conexão MongoDB (opcional, se usar variável) |

**Exemplo:**
```
RENDER_BACKEND_WEBHOOK: https://api.render.com/deploy/srv-abc123...
RENDER_DEPLOY_WEBHOOK: https://api.render.com/deploy/srv-def456...
```

---

## 🧪 Passo 6: Testar o Deploy Automático

### 6.1 Fazer uma mudança pequena

```bash
# Na pasta do projeto
echo "# Deploy teste" >> DEPLOY-TEST.md
git add DEPLOY-TEST.md
git commit -m "Test auto-deploy"
git push origin main
```

### 6.2 Verificar se dispara o workflow

1. Vá em **GitHub** → Aba **"Actions"**
2. Você deve ver um workflow em execução
3. Aguarde completar (indicador verde ✅ ou vermelho ❌)

### 6.3 Conferir o deploy no Render

1. Vá em **Render** → seu serviço
2. Aba **"Events"** deve mostrar novo deploy
3. Status deve ser **"Live"** (verde)

---

## 📊 URLs Finais

Após tudo configurado, você terá:

- **Frontend:** `https://rdr2-frontend.onrender.com`
- **Backend API:** `https://rdr2-backend.onrender.com`

---

## ⚙️ Configuração do Frontend para Usar Backend

Se o frontend ainda apontar para `localhost:3000`, atualize em:

**Arquivo:** `rdr2-frontend/src/app/services/database.ts`

```typescript
// Antes:
private apiUrl = 'http://localhost:3000/api';

// Depois:
private apiUrl = 'https://rdr2-backend.onrender.com/api';
```

Commit e push essa mudança para atualizar automaticamente.

---

## 🐛 Troubleshooting

### Build falha no Render

**Solução:**
1. Verifique os logs no Render (aba "Logs")
2. Certifique-se que `npm install` roda bem localmente
3. Verifique se o `package.json` existe nas pastas corretas

### Frontend não conecta ao Backend

**Solução:**
1. Verifique a URL da API no código do frontend
2. Confirme que o Backend está rodando no Render
3. Verifique CORS no `server.js`

```javascript
// rdr2-dashboard-backend/server.js
app.use(cors({
  origin: 'https://rdr2-frontend.onrender.com',
  credentials: true
}));
```

### Webhook não funciona

**Solução:**
1. Verifique o Secret foi adicionado corretamente no GitHub
2. Nome do secret deve ser exato: `RENDER_BACKEND_WEBHOOK` ou `RENDER_DEPLOY_WEBHOOK`
3. Verifique que a URL do webhook está completa (inclui `https://`)

---

## ✅ Checklist Final

- [ ] Conta Render criada
- [ ] Serviço Backend criado e rodando no Render
- [ ] Serviço Frontend criado e rodando no Render
- [ ] Webhooks copiados do Render
- [ ] Secrets adicionados no GitHub (RENDER_BACKEND_WEBHOOK, RENDER_DEPLOY_WEBHOOK)
- [ ] GitHub Actions workflows configurados em `.github/workflows/`
- [ ] Teste de push realizado
- [ ] Workflow executado com sucesso
- [ ] Render fez deploy automático
- [ ] Frontend conecta ao Backend API
- [ ] App rodando em produção! 🎉

---

## 📞 Suporte

Se algo der errado:

1. Verifique os **Logs** no Render (mais informações lá)
2. Veja **Actions** no GitHub (workflow logs)
3. Abra DevTools do navegador (F12) para ver erros do frontend

---

**Deploy automático configurado! 🚀**

A partir de agora, cada push para `main` fará:
1. GitHub Actions roda os testes
2. Se OK → Render faz deploy automático
3. App atualizado em produção
