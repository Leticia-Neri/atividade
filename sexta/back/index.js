const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const cors = require('cors');

const app = express();
const port = 3000;
const uri = "mongodb+srv://cadastro:M2D7O42IpPqKYhhd@cluster0.sul4o.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'kart';


app.use(express.json());
app.use(cors());


// Função para se conectar ao MongoDB
async function connectToMongo() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db();
}



// Rota GET para obter os registros
app.get('/registros', async (req, res) => {
  try {
    const db = await connectToMongo();
    const registros = await db.collection('registros').find().toArray();
    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os registros.' });
  }
});

// Rota POST para criar um novo registro
app.post('/registros', async (req, res) => {
  try {
    const { nome, numero, posicao, categoria } = req.body;
    const db = await connectToMongo();
    const result = await db.collection('registros').insertOne({
      nome,
      numero,
      posicao,
      categoria,
    });
    if (result && result.ops && result.ops.length > 0) {
      res.json(result.ops[0]);
    } else {
      throw new Error('Falha ao criar o registro.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o registro.' });
  }
});



// Rota PUT para atualizar um registro existente


app.put('/registros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, numero, posicao, categoria } = req.body;
    const db = await connectToMongo();
    const result = await db.collection('registros').updateOne(
      { _id: ObjectId(id) },
      { $set: { nome, numero, posicao, categoria } }
    );
    res.json({ message: 'Registro atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar o registro.' });
  }
});

// Crie o banco de dados e a coleção (tabela)
// async function setupDatabase() {
//   try {
//     const client = new MongoClient(uri);
//     await client.connect();
//     const db = client.db(dbName);
//     await db.createCollection('registros');
//     console.log('Banco de dados configurado com sucesso!');
//   } catch (error) {
//     console.error('Erro ao configurar o banco de dados:', error);
//   }
// }

// Inicie o servidor
app.listen(port, () => {
  console.log(`API está rodando em http://localhost:${port}`);
  // setupDatabase();
});