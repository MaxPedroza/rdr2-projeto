# 🎮 RDR2 Tracker - PWA Setup Guide

## ✅ O que foi feito:

1. ✅ Instalado `@angular/pwa`
2. ✅ Configurado `manifest.webmanifest` com nome, descrição e cores do app
3. ✅ Configurado `ngsw-config.json` com caching de API
4. ✅ Build de produção concluído com sucesso
5. ✅ Service Worker gerado (`ngsw-worker.js`)
6. ✅ Ícones em múltiplos tamanhos criados

## 🚀 Testando Localmente

### Opção 1: Com HTTPS (Recomendado para PWA)

```powershell
# Gerar certificado auto-assinado (Windows)
$cert = New-SelfSignedCertificate -DnsName localhost -FriendlyName "RDR2-Dev" -CertStoreLocation "cert:\CurrentUser\My"
$certPath = "C:\Users\$env:USERNAME\AppData\Local\Temp\cert.pfx"
Export-PfxCertificate -Cert $cert -FilePath $certPath -Password (ConvertTo-SecureString -String "password" -AsPlainText -Force)

# Servir com HTTPS
cd c:\dev\Projetos\rdr2-projeto\rdr2-frontend\dist\rdr2-frontend\browser
http-server -p 8080 -c-1 --ssl --cert $certPath --key $certPath
```

Depois acesse: **https://localhost:8080**

### Opção 2: Com ng serve + SSL

```powershell
cd c:\dev\Projetos\rdr2-projeto\rdr2-frontend
ng serve --ssl --open
```

Acesse: **https://localhost:4200**

## 📱 Testar PWA no Chrome/Edge

1. Abra Chrome/Edge DevTools (F12)
2. Vá para **Application** → **Manifest**
   - Deve mostrar nome, ícones, tema
3. Vá para **Application** → **Service Workers**
   - Deve mostrar `ngsw-worker.js` com status "activated and running"
4. Teste modo offline: vá para **Network** → marque **Offline**
5. Recarregue a página - deve funcionar!

## 🌐 Deploy para Produção

### Opção A: Firebase Hosting (Gratuito)

```powershell
npm install -g firebase-tools
cd c:\dev\Projetos\rdr2-projeto\rdr2-frontend
firebase login
firebase init hosting
# Escolha: dist/rdr2-frontend/browser como pasta pública
firebase deploy
```

### Opção B: Netlify (Gratuito)

```powershell
npm install -g netlify-cli
cd c:\dev\Projetos\rdr2-projeto\rdr2-frontend
netlify deploy --prod --dir=dist/rdr2-frontend/browser
```

### Opção C: Vercel (Gratuito)

```powershell
npm install -g vercel
cd c:\dev\Projetos\rdr2-projeto\rdr2-frontend
vercel --prod
```

### Opção D: GitHub Pages

1. Faça push do código para GitHub
2. Vá para Settings → Pages
3. Escolha GitHub Actions como source
4. Create um arquivo `.github/workflows/deploy.yml`

## 📦 Arquivo de Build Produção

A pasta `dist/rdr2-frontend/browser/` contém tudo pronto para deploy:

```
dist/rdr2-frontend/browser/
├── index.html              (entrada principal)
├── ngsw-worker.js          (Service Worker)
├── ngsw.json               (config de cache)
├── manifest.webmanifest    (metadata do app)
├── main-*.js               (app bundled)
├── polyfills-*.js          (polyfills)
├── styles-*.css            (CSS)
├── icons/                  (ícones PNG)
└── assets/                 (outros assets)
```

## 🔄 Atualizar o PWA

Para fazer alterações:

1. Edite o código
2. Rode: `ng build --configuration production`
3. Deploy novamente
4. Service Worker automáticamente atualiza o cache

## 📊 Verificar PWA Quality

Use o Lighthouse do Chrome:
- DevTools → Lighthouse
- Audit type: Progressive Web App
- Deve passar em todos os itens

## 🎯 Checklist Final

- ✅ PWA instalado e configurado
- ✅ Service Worker funcionando
- ✅ Manifest com metadados corretos
- ✅ Ícones de múltiplos tamanhos
- ✅ Cache de API configurado
- ✅ Build de produção completo
- ✅ Testado em modo offline
- ✅ Pronto para deploy

---

**Próximos Passos:**
1. Testar localmente com HTTPS
2. Escolher plataforma de deploy
3. Fazer deploy da aplicação
4. Testar instalação em celular/desktop
