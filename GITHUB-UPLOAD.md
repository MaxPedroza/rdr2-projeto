# 🚀 Guia Definitivo: Upload para GitHub

## Pré-requisitos

- [ ] Conta GitHub criada em https://github.com
- [ ] Git instalado no seu computador
- [ ] Arquivo `.env` NÃO está na pasta do projeto
- [ ] Você leu este documento até o fim

---

## ✅ Verificação Final

Antes de fazer upload, execute:

```bash
cd c:\dev\Projetos\rdr2-projeto

# Verificar se .env não vai ser commitado
git status --ignored

# Resultado esperado: .env aparece em "Ignored files"
```

---

## 🎯 Opção A: Criar Repositório Novo no GitHub

### Passo 1: Criar Repositório (na web)

1. Acesse https://github.com/new
2. Preencha assim:

```
Repository name:     rdr2-projeto
Description:         RDR2 Tracker Dashboard - Rastreador de colecionáveis
Visibility:          Public (ou Private se preferir)
Initialize:          NÃO marque nada
```

3. Clique em "Create repository"
4. Copie a URL que aparece (ex: `https://github.com/seu-usuario/rdr2-projeto.git`)

### Passo 2: Conectar Seu Código Local

```bash
cd c:\dev\Projetos\rdr2-projeto

# Inicializar Git (se não tiver feito ainda)
git init

# Adicionar arquivo de configuração global (primeira vez apenas)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@github.com"

# Adicionar todos os arquivos
git add .

# Verificar o que será commitado
git status

# Fazer commit
git commit -m "Initial commit: v1.0 MongoDB version

- Complete project documentation (README.md)
- Quick setup guide (SETUP.md)
- Security configuration (.gitignore, .env.example)
- Fully commented code with sections
- Ready for GitHub and collaboration"

# Conectar ao repositório GitHub
git remote add origin https://github.com/SEU-USUARIO/rdr2-projeto.git

# Renomear branch para 'main' (padrão GitHub)
git branch -M main

# Fazer upload para GitHub
git push -u origin main
```

### Pronto! ✅

Seu código está no GitHub! Acesse:
```
https://github.com/seu-usuario/rdr2-projeto
```

---

## 🎯 Opção B: Clonar Primeiro (Mais Seguro)

Se preferir:

```bash
# 1. Crie o repo vazio no GitHub (sem inicializar)

# 2. Clone para um local temporário
cd C:\temp
git clone https://github.com/seu-usuario/rdr2-projeto.git

# 3. Copie seus arquivos para dentro
cp -r c:\dev\Projetos\rdr2-projeto\* c:\temp\rdr2-projeto\

# 4. Commite e faça push
cd c:\temp\rdr2-projeto
git add .
git commit -m "Initial commit: v1.0"
git push origin main
```

---

## ✅ Verificar Upload

Depois de fazer push, acesse:

```
https://github.com/seu-usuario/rdr2-projeto
```

Você deveria ver:

- ✅ README.md renderizado
- ✅ Pastas: Banco, rdr2-dashboard-backend, rdr2-frontend
- ✅ Arquivos: .gitignore, SETUP.md, STATUS.md, etc
- ✅ **NÃO** ver pasta `node_modules` ou arquivo `.env`

---

## 🔄 Próximos Commits (Após o Primeiro)

Para próximas alterações:

```bash
cd c:\dev\Projetos\rdr2-projeto

# Adicionar arquivos modificados
git add .

# Ou adicionar arquivo específico
git add src/app/app.ts

# Commit
git commit -m "Descrição clara da mudança"

# Push
git push
```

---

## 🌿 Criar Branch para v1.1 (JSON Local)

Depois que v1.0 estiver no GitHub:

```bash
# Criar nova branch
git checkout -b json-local

# Fazer alterações para versão JSON local
# (modificar server.js, etc)

# Commit das mudanças
git add .
git commit -m "WIP: Converting to JSON local storage"

# Fazer push da branch
git push -u origin json-local

# No GitHub: Criar Pull Request para revisar
```

---

## 📱 Criar Branch para PWA

```bash
git checkout -b pwa

# Adicionar Service Worker, manifest.json, etc

git add .
git commit -m "WIP: Progressive Web App setup"
git push -u origin pwa
```

---

## 🐛 Desfazer Último Commit (Se Algo Deu Errado)

```bash
# Se não fez push ainda
git reset --soft HEAD~1
git reset HEAD

# Se fez push (cuidado!)
git revert HEAD
git push
```

---

## 📋 Arquivos que Será Feito Upload

✅ Será enviado:
```
rdr2-projeto/
├── .gitignore
├── .env.example
├── README.md
├── SETUP.md
├── CHECKLIST-GITHUB.md
├── STATUS.md
├── GITHUB-SUMMARY.txt
├── check-setup.sh
├── Banco/
│   └── (13 arquivos JSON)
├── rdr2-dashboard-backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
└── rdr2-frontend/
    ├── src/
    ├── package.json
    ├── angular.json
    └── (etc)
```

❌ Será IGNORADO (.gitignore):
```
node_modules/
.env (arquivo real com credenciais)
dist/
.angular/
*.log
```

---

## 🆘 Problemas Comuns

### Erro: "fatal: not a git repository"

```bash
cd c:\dev\Projetos\rdr2-projeto
git init
```

### Erro: "Authentication failed"

Você pode estar usando HTTPS enquanto tem 2FA no GitHub.

Solução:

```bash
# Criar personal access token em GitHub
# https://github.com/settings/tokens

# Usar token como senha:
git remote set-url origin https://seu-usuario:seu-token@github.com/seu-usuario/rdr2-projeto.git

# Ou usar SSH (mais seguro)
git remote set-url origin git@github.com:seu-usuario/rdr2-projeto.git

# Configurar chave SSH:
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Erro: "Permission denied (publickey)"

Você está usando SSH sem ter configurado chaves.

Solução:

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@github.com"

# Copie o conteúdo de ~/.ssh/id_ed25519.pub
# Vá em GitHub Settings > SSH and GPG keys > New SSH key
# Cole e salve

# Teste a conexão
ssh -T git@github.com
```

---

## ✨ Dicas Finais

1. **Mensagens de Commit Claras**
   ```
   ✅ "Add user authentication"
   ❌ "fix stuff"
   
   ✅ "Fix MongoDB connection error"
   ❌ "bug fix"
   ```

2. **Commit Frequente**
   - Faça commits pequenos e lógicos
   - Não acumule muitas mudanças

3. **Sempre Faça Pull Antes de Push**
   ```bash
   git pull origin main
   git push origin main
   ```

4. **Use .gitignore Rigorosamente**
   - Nunca commite `.env` com dados reais
   - Verificar antes de cada push

---

## 🎉 Você Está Pronto!

Siga estes passos e seu projeto estará no GitHub em 5 minutos!

**Dúvidas?** Leia o `README.md` ou `SETUP.md` do seu projeto.

---

**Status:** ✅ PRONTO PARA GITHUB  
**Data:** 30 de dezembro de 2025  
**Próximo Passo:** Criar repositório em https://github.com/new
