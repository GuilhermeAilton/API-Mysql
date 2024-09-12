const express = require('express')
const app = express()
const clients = require("./models/clients")
const connection = require('./database/connection')


app.use(express.json())

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar: ' + err.stack);
      return;
    }
    console.log('Conectado como ID ' + connection.threadId);
  });

app.get('/', (req,res) => {
    const query = 'SELECT * FROM clientes';
  
    // Executar a consulta
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta: ' + err.stack);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
  
      if (results.length > 0) {
        // Se houver resultados, envia o cliente encontrado como resposta JSON
        res.json(results);
      } else {
        // Se não houver resultados, envia uma mensagem de erro como resposta JSON
        res.status(404).json({ message: `Nenhum cliente encontrado com o ID: ${id}` });
      }
    });
  });
    

// Rota para obter cliente por ID
app.get('cliente/:id', (req, res) => {
    const { id } = req.params;
  
    // Definir a consulta SQL com um placeholder para evitar injeção SQL
    const query = 'SELECT * FROM clientes WHERE id = ?';
  
    // Executar a consulta
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta: ' + err.stack);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
  
      if (results.length > 0) {
        // Se houver resultados, envia o cliente encontrado como resposta JSON
        res.json(results[0]);
      } else {
        // Se não houver resultados, envia uma mensagem de erro como resposta JSON
        res.status(404).json({ message: `Nenhum cliente encontrado com o ID: ${id}` });
      }
    });
  });

app.post('/cliente',(req,res)=> {
    const {name} = req.body
    const query = 'INSERT INTO clientes (nome) VALUES (?)';

     // Executar a consulta
  connection.query(query, [name], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.stack);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }

    // Envia uma resposta JSON com o ID do novo cliente inserido
    res.json({ id: results.insertId, name });
  });
});


// Atualizando dado a partir do id 
app.put('/cliente/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
   const query = 'UPDATE clientes SET nome = ? WHERE id = ?'
   connection.query(query, [name,id], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.stack);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    res.json('Cliente atualizado com sucesso');
  });
});

// ENDPOINT PARA APAGAR CLIENTE ATRAVES DO ID
app.delete('/cliente/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = ?;';

     // Executar a consulta
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.stack);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    res.json('Cliente deletado com sucesso');
  });
    
   
});


app.listen(3000, () => {
    console.log("Servidor rodando na porta : 3000")
})