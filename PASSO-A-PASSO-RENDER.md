# 🚀 Guia Passo-a-Passo: Deploy no Render

## ✅ Status
- ✅ Conta Render criada
- 🔄 **Próximo: Deployar Backend**

---

## 📌 PASSO 1: DEPLOYAR O BACKEND

### 1.1 Acessar Dashboard do Render
1. Vá em https://dashboard.render.com
2. Você deve estar logado

### 1.2 Criar novo Web Service
1. Clique **"New +"** (topo direito)
2. Selecione **"Web Service"**

### 1.3 Conectar Repositório GitHub
1. Na seção **"Connect a repository"**:
   - Procure por `rdr2-projeto` (ou `MaxPedroza/rdr2-projeto`)
   - Clique no repositório para conectar
   - **Autorize o acesso** ao Render no GitHub

### 1.4 Configurar o Serviço Backend

Preencha os campos assim:

```
Name: rdr2-backend
Runtime: Node
Build Command: cd rdr2-dashboard-backend && npm install
Start Command: cd rdr2-dashboard-backend && npm start
Instance Type: Free (gratuito)
```

### 1.5 Adicionar Variáveis de Ambiente

1. Role para baixo até **"Environment"**
2. Clique **"Add Environment Variable"**
3. Adicione uma por uma:

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://rdr2-frontend.onrender.com` |

⚠️ **Importante:** deixe `CORS_ORIGIN` como indicado acima (vamos atualizar depois se precisar)

### 1.6 Criar o Serviço

1. Clique **"Create Web Service"** (botão azul no final)
2. ⏳ **Aguarde 2-3 minutos** enquanto o build acontece
3. Você deve ver `Deploy successful` no topo
4. **COPIE A URL** que aparece (tipo: `https://rdr2-backend.onrender.com`)

---

## 📌 PASSO 2: DEPLOYAR O FRONTEND

### 2.1 Criar novo Static Site
1. De volta no dashboard, clique **"New +"**
2. Selecione **"Static Site"** (não Web Service)

### 2.2 Conectar Repositório GitHub
Mesmo processo anterior:
- Procure `rdr2-projeto`
- Clique para conectar

### 2.3 Configurar o Serviço Frontend

Preencha assim:

```
Name: rdr2-frontend
Publish Directory: rdr2-frontend/dist/rdr2-frontend/browser
Build Command: cd rdr2-frontend && npm install && npm run build
```

⚠️ **Importante:** O `Publish Directory` deve ser exatamente:
```
rdr2-frontend/dist/rdr2-frontend/browser
```

### 2.4 Criar o Serviço

1. Clique **"Create Static Site"**
2. ⏳ **Aguarde 3-5 minutos** para o build Angular compilar
3. Você deve ver `Deploy successful`
4. **COPIE A URL** (tipo: `https://rdr2-frontend.onrender.com`)

---

## 🔗 PASSO 3: OBTER OS WEBHOOKS

### 3.1 Webhook do Backend

1. No dashboard, clique no serviço **"rdr2-backend"**
2. Vá em **"Settings"** (tab no topo)
3. Role até **"Deploy Hook"**
4. Clique em **"Copy"** ou selecione a URL
5. **SALVE ESSA URL** (vamos usar em breve)

Exemplo: `https://api.render.com/deploy/srv-...`

### 3.2 Webhook do Frontend

1. Clique no serviço **"rdr2-frontend"**
2. Vá em **"Settings"**
3. Procure **"Deploy Hook"** (pode estar no final)
4. **COPIE ESSA URL** também

---

## 🔐 PASSO 4: ADICIONAR SECRETS NO GITHUB

### 4.1 Abrir Settings do Repositório

1. Vá em https://github.com/MaxPedroza/rdr2-projeto
2. Clique em **"Settings"** (ícone ⚙️ no topo)
3. Sidebar esquerda: **"Secrets and variables"** → **"Actions"**

### 4.2 Adicionar Secret 1: Backend Webhook

1. Clique **"New repository secret"** (botão verde)
2. Preencha:
   ```
   Name: RENDER_BACKEND_WEBHOOK
   Secret: [Cole aqui a URL do webhook do Backend]
   ```
3. Clique **"Add secret"**

### 4.3 Adicionar Secret 2: Frontend Webhook

1. Clique **"New repository secret"** novamente
2. Preencha:
   ```
   Name: RENDER_DEPLOY_WEBHOOK
   Secret: [Cole aqui a URL do webhook do Frontend]
   ```
3. Clique **"Add secret"**

---

## ✅ Verificar se funcionou

### 5.1 Testar Deploy Automático

No seu terminal local:

```bash
cd c:\dev\Projetos\rdr2-projeto

# Fazer uma mudança pequena
echo "# Deploy Test $(date)" >> DEPLOY-TEST.md

# Commit e Push
git add DEPLOY-TEST.md
git commit -m "🧪 Test automatic deployment"
git push origin main
```

### 5.2 Verificar GitHub Actions

1. Vá em https://github.com/MaxPedroza/rdr2-projeto
2. Clique em **"Actions"** (tab no topo)
3. Você deve ver um workflow em execução
4. Aguarde completar (indicador verde ✅)

### 5.3 Verificar Deploy no Render

1. Vá em https://dashboard.render.com
2. Verifique se ambos os serviços têm status **"Live"** (verde)
3. Clique em cada um e vá na aba **"Events"** para ver o novo deploy

---

## 🎉 Pronto!

Agora você tem:

- **Frontend:** https://rdr2-frontend.onrender.com
- **Backend:** https://rdr2-backend.onrender.com
- **Auto-deploy:** Cada `git push` atualiza a app automaticamente!

---

## 🐛 Se algo der errado

### Backend não inicia?
- Verifique **Logs** no Render
- Certifique-se que `node_modules` foi instalado
- Check se `server.js` existe em `rdr2-dashboard-backend/`

### Frontend mostra erro de conectividade?
- O frontend detecta a URL automaticamente
- Se ainda der erro, verifique console (F12 no navegador)
- Certifique-se que Backend está com status "Live"

### Webhook não funciona?
- Verifique que os secrets foram adicionados **exatamente** com os nomes:
  - `RENDER_BACKEND_WEBHOOK`
  - `RENDER_DEPLOY_WEBHOOK`
- URLs devem começar com `https://`
- Teste fazendo um push novo

---

**Siga esses passos e o app estará rodando em produção! 🚀**
