const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BANCO_DIR = path.resolve(__dirname, '../Banco');

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de erro para catch erros do JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ erro: 'JSON inválido' });
  }
  next();
});

console.log('\n🎮 RDR2 Tracker Server\n' + '='.repeat(50));
console.log(`📂 Banco Path: ${BANCO_DIR}`);
console.log(`✓ Banco existe: ${fs.existsSync(BANCO_DIR)}\n`);

// ============================================
// ROTAS
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// API Root
app.get('/api', (req, res) => {
  res.json({ 
    versao: '1.0.0',
    nome: 'RDR2 Tracker API',
    endpoints: [
      'GET /health',
      'GET /api/colecoes',
      'GET /api/:categoria',
      'GET /api/:categoria/:colecao'
    ]
  });
});

// Listar categorias (pastas do Banco)
app.get('/api/colecoes', (req, res) => {
  try {
    const items = fs.readdirSync(BANCO_DIR);
    const dirs = items.filter(item => 
      fs.statSync(path.join(BANCO_DIR, item)).isDirectory()
    );
    
    res.json({
      total: dirs.length,
      colecoes: dirs.sort()
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar tudo de uma categoria
app.get('/api/:categoria', (req, res) => {
  try {
    const { categoria } = req.params;
    const catPath = path.join(BANCO_DIR, categoria);
    
    if (!fs.existsSync(catPath)) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    
    const stats = fs.statSync(catPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ erro: 'Não é uma categoria válida' });
    }

    const allItens = [];

    // Função recursiva para buscar JSONs em subpastas
    function lerJsonsRecursivo(dir) {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const itemStats = fs.statSync(fullPath);
        
        if (itemStats.isFile() && item.endsWith('.json')) {
          try {
            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            if (Array.isArray(data)) {
              allItens.push(...data);
            } else {
              allItens.push(data);
            }
          } catch (e) {
            console.error(`Erro ao ler ${item}:`, e.message);
          }
        } else if (itemStats.isDirectory()) {
          // Recursivamente procura em subpastas
          lerJsonsRecursivo(fullPath);
        }
      });
    }

    lerJsonsRecursivo(catPath);
    return res.json(allItens);
    
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar arquivo específico em uma categoria
app.get('/api/:categoria/:arquivo', (req, res) => {
  try {
    const { categoria, arquivo } = req.params;
    const catPath = path.join(BANCO_DIR, categoria);
    
    if (!fs.existsSync(catPath)) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    
    // Procurar arquivo que contém o nome
    const files = fs.readdirSync(catPath);
    const targetFile = files.find(f => 
      f.includes(arquivo) && f.endsWith('.json')
    );
    
    if (!targetFile) {
      return res.status(404).json({ 
        erro: `Arquivo '${arquivo}' não encontrado em '${categoria}'` 
      });
    }
    
    const filePath = path.join(catPath, targetFile);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    res.json({
      categoria,
      arquivo: targetFile,
      total: Array.isArray(data) ? data.length : 1,
      dados: data
    });
  } catch (err) {
    console.error('Erro em GET /:categoria/:arquivo:', err);
    res.status(500).json({ erro: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ 
    erro: 'Rota não encontrada',
    rota: req.path,
    metodo: req.method
  });
});

// Start
const server = app.listen(PORT, () => {
  console.log(`✓ Servidor rodando: http://localhost:${PORT}`);
  console.log(`📚 Colecoes: http://localhost:${PORT}/api/colecoes`);
  console.log(`💚 Health: http://localhost:${PORT}/health\n`);
});

