# 🚀 Setup Rápido - RDR2 Tracker Dashboard

Siga estes passos para rodar o projeto localmente.

---

## 📋 Checklist Pré-Requisitos

- [ ] Node.js v18+ instalado
- [ ] npm ou yarn
- [ ] Conta MongoDB Atlas (grátis em mongodb.com)
- [ ] Credenciais MongoDB prontas

---

## ⚡ Setup em 5 Minutos

### 1. Crie arquivo `.env` (Backend)

Na raiz da pasta `rdr2-dashboard-backend/`:

```bash
# Copiar template
cp ../.env.example .env

# Ou criar manualmente com seu editor:
# PORT=3000
# NODE_ENV=development
# MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/rdr2_tracker_db?retryWrites=true&w=majority
```

**Obter URI MongoDB:**
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Vá em "Clusters" → "Connect" → "Drivers"
3. Copie a connection string
4. Substitua `<username>:<password>` com suas credenciais

### 2. Instale Dependências (Backend)

```bash
cd rdr2-dashboard-backend
npm install
```

### 3. Inicie Backend

```bash
npm start
```

✅ Você verá: `Servidor OK na porta 3000`

### 4. Novo Terminal - Instale Frontend

```bash
cd rdr2-frontend
npm install
```

### 5. Inicie Frontend

```bash
npm start
```

✅ Abrirá automaticamente em `http://localhost:4200`

---

## ✅ Verificar se Tudo Funciona

1. **Backend respondendo?**
   ```bash
   curl http://localhost:3000/api/equipamentos
   ```
   Devolveu JSON? ✅

2. **Frontend carregou?**
   - Acesse http://localhost:4200
   - Vê a dashboard? ✅

3. **Consegue marcar um item?**
   - Clique em um item
   - Marque um material
   - Salvou? ✅

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| MongoError: authentication failed | Verifique credentials em `.env` |
| Port 3000 already in use | Mude PORT em `.env` ou feche outro app |
| Cannot find module | Rode `npm install` novamente |
| CORS error | Backend está rodando na porta correta? |

---

## 📁 Estrutura de Pastas para Lembrar

```
rdr2-projeto/
├── .env.example         ← Copie para .env em cada pasta
├── .gitignore           ← Já configurado
├── README.md            ← Documentação completa
│
├── rdr2-dashboard-backend/
│   ├── .env             ← Você cria aqui
│   ├── package.json
│   └── server.js        ← Startup do backend
│
└── rdr2-frontend/
    ├── package.json
    ├── angular.json
    └── src/app/         ← Código da dashboard
```

---

## 🎯 Próximos Passos

- [ ] Rodar projeto localmente
- [ ] Fazer commit inicial no GitHub
- [ ] Criar branch para versão JSON
- [ ] Converter para PWA

**Pronto?** Abra uma issue se tiver problemas! 💪
