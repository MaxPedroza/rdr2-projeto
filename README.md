# RDR2 Tracker Dashboard

Uma aplicação web para rastrear items, missões e colecionáveis de **Red Dead Redemption 2**. 

🔍 **Versão 1.0 (Mongo)** - Setup inicial com MongoDB. Versões futuras incluirão variante com JSON local e PWA.

---

## 📋 Funcionalidades

- ✅ Rastrear equipamentos, armas e acessórios
- ✅ Acompanhar materiais de crafting
- ✅ Gerenciar receitas e itens do Trapper
- ✅ Filtrar por personagem (Arthur/John)
- ✅ Visualizar estatísticas globais
- ✅ Buscar e organizar por categoria
- ✅ Modo Trapper (grupos de itens)
- ✅ Ações em massa (marcar/desmarcar itens)

---

## 🏗️ Estrutura do Projeto

```
rdr2-projeto/
├── rdr2-dashboard-backend/     # API Express + MongoDB
│   ├── server.js               # Servidor principal
│   ├── package.json            # Dependências Node
│   └── node_modules/           # (gerado em npm install)
│
├── rdr2-frontend/              # App Angular 17 Standalone
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts          # Componente principal
│   │   │   ├── app.html        # Template
│   │   │   ├── app.css         # Estilos
│   │   │   └── services/
│   │   │       └── database.ts # Serviço HTTP
│   │   ├── styles.css          # Reset global
│   │   └── main.ts             # Bootstrap
│   ├── package.json
│   └── angular.json
│
├── Banco/                      # Arquivos JSON (backup/referência)
│   ├── rdr2_tracker_db.equipamentos.json
│   ├── rdr2_tracker_db.amuletos.json
│   └── ... (mais 11 coleções)
│
├── .gitignore                  # Arquivo de controle de versão
├── .env.example                # Template de variáveis
└── README.md                   # Este arquivo
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** ou **yarn**
- **MongoDB Atlas** (conta grátis em [mongodb.com](https://www.mongodb.com/cloud/atlas))
- **Angular CLI** (opcional, para desenvolvimento)

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/seu-usuario/rdr2-projeto.git
cd rdr2-projeto
```

### 2️⃣ Configure o Backend

```bash
cd rdr2-dashboard-backend

# Instale dependências
npm install

# Crie arquivo .env baseado no .env.example
cp ../.env.example .env

# Edite .env com suas credenciais MongoDB
# MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster...
```

**Como obter credenciais MongoDB:**
1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster (gratuito)
3. Crie um usuário e password
4. Copie a connection string
5. Substitua `seu_usuario:sua_senha` na `.env`

### 3️⃣ Inicie o Backend
```bash
npm start
# Saída esperada: "Servidor OK na porta 3000"
```

### 4️⃣ Configure o Frontend

```bash
cd ../rdr2-frontend

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
# Ou: ng serve --open
```

A aplicação abrirá em **http://localhost:4200**

---

## 📚 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/:colecao` | Lista todos os itens da coleção |
| `POST` | `/api/:colecao` | Cria novo item |
| `PUT` | `/api/:colecao/:id` | Atualiza status do item |
| `PATCH` | `/api/atualizar-por-nome/:colecao` | Atualiza item por nome |

**Exemplo:**
```bash
# Listar equipamentos
curl http://localhost:3000/api/equipamentos

# Marcar item como obtido
curl -X PUT http://localhost:3000/api/equipamentos/ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{"obtido": true}'
```

---

## 🗂️ Coleções MongoDB

O banco contém 13 coleções principais:

- `equipamentos` - Armas, revólveres, pistolas
- `amuletos` - Talismãs e amuletos
- `animais` - Caça de animais lendários
- `colecionaveis` - Itens colecionáveis
- `desafios` - Missões de desafio
- `missoes_mundo` - Missões do mapa
- `pearson` - Itens do Pearson (costureira)
- `pedidos_entrega` - Missões de entrega
- `peixes_lendarios` - Localizações de peixes
- `pontos_interesse` - Locais especiais
- `receitas` - Receitas de crafting
- `trapper_conjuntos` - Conjuntos de roupas
- `trapper_roupas` - Roupas individuais

---

## 📱 Tecnologias Usadas

### Frontend
- **Angular 17** (Standalone Components)
- **TypeScript**
- **RxJS** (Reactive programming)
- **Bootstrap CSS Custom** (tema RDR2)

### Backend
- **Node.js + Express**
- **MongoDB** (v1.0)
- **CORS** (requisições cross-origin)

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz ou em `rdr2-dashboard-backend/`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/rdr2_tracker_db?retryWrites=true&w=majority
```

⚠️ **Nunca faça commit de `.env` com dados reais!** Use `.gitignore`.

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
cd rdr2-dashboard-backend
npm install
```

### "MongoError: authentication failed"
- Verifique as credenciais em `.env`
- Confirme que o IP está liberado no MongoDB Atlas
- Tente resetar a senha do usuário

### "Port 3000 already in use"
```bash
# Linux/Mac
lsof -i :3000
kill -9 PID

# Windows (PowerShell como admin)
netstat -ano | findstr :3000
taskkill /PID PID /F
```

### "Angular app não conecta à API"
- Certifique-se que o backend está rodando na porta 3000
- Verifique CORS em `server.js`

---

## 📝 Roadmap

- ✅ v1.0 - Backend MongoDB + Frontend Angular
- 🟡 v1.1 - Versão JSON Local (cópia deste repo)
- 🟡 v1.2 - PWA com suporte offline
- 🟡 v2.0 - Deploy em hospedagem estática (Netlify/Vercel)
- 🟡 v2.1 - Suporte multi-usuário (autenticação)

---

## 🤝 Contribuindo

1. Crie uma **branch** para sua feature (`git checkout -b feature/sua-feature`)
2. **Commit** suas mudanças (`git commit -m "Adiciona tal coisa"`)
3. **Push** para a branch (`git push origin feature/sua-feature`)
4. Abra um **Pull Request**

---

## 📄 Licença

Este projeto é fornecido como está. Respeite a marca **Red Dead Redemption 2** da Rockstar Games.

---

## 👨‍💻 Autor

Desenvolvido como projeto pessoal para rastreamento de colecionáveis em RDR2.

**Contato:** Disponível no GitHub

---

## 🎮 Créditos

Dados dos items baseados em:
- [Red Dead Redemption 2 Wiki](https://reddead.fandom.com/)
- Coleta manual in-game

Design inspirado no universo RDR2 com paleta de cores Western.
