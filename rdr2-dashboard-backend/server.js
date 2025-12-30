const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rota GET (Listar)
app.get('/api/:colecao', async (req, res) => {
  const { colecao } = req.params;
  const db = mongoose.connection.db;
  const dados = await db.collection(colecao).find({}).toArray();
  res.json(dados);
});

// ROTA POST (Cadastrar Novo) - ADICIONA ESTA
app.post('/api/:colecao', async (req, res) => {
  try {
    const { colecao } = req.params;
    const novoItem = req.body;
    const db = mongoose.connection.db;
    
    // Define como falso por padrão se não for enviado
    if (novoItem.obtido === undefined) novoItem.obtido = false;

    const resultado = await db.collection(colecao).insertOne(novoItem);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota PUT (Atualizar Status)
app.put('/api/:colecao/:id', async (req, res) => {
  const { colecao, id } = req.params;
  const { obtido } = req.body;
  const db = mongoose.connection.db;
  await db.collection(colecao).updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { obtido } }
  );
  res.json({ message: 'Atualizado' });
});


mongoose.connect('mongodb+srv://MaxwellPedroza:P3d20z45891mongodbbanco@meus-projetos.0nodwvy.mongodb.net/rdr2_tracker_db?retryWrites=true&w=majority&appName=Meus-Projetos')
  .then(() => app.listen(3000, () => console.log('Servidor OK na porta 3000')));