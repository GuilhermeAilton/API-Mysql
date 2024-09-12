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
    res.send(clients)
    
})

app.get('/:id', (req,res) => {
    const {id} = req.params
    const client = clients.find(client => client.id === Number(id) )
    
    if(client){
        res.send(client)

    }else{
        res.send("Cliente não encontrado")
        
    }
})

app.post('/cliente',(req,res)=> {
    const {name} = req.body
    const id = clients.length + 1; 

    clients.push({id,name});
    res.send("Cliente adicionado")

})


app.put('/cliente/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    // Encontra o índice do cliente com o ID fornecido
    const clientIndex = clients.findIndex(client => client.id === Number(id));

    if (clientIndex !== -1) {
        // Cliente existe, atualiza o nome
        clients[clientIndex].name = name;
        res.send("Cliente atualizado");
    } else {
        // Cliente não existe, adiciona um novo
        clients.push({ id: Number(id), name });
        res.send("Cliente adicionado");
    }
});

// ENDPOINT PARA APAGAR CLIENTE ATRAVES DO ID
app.delete('/cliente/:id', (req, res) => {
    const { id } = req.params;
    // Encontra o índice do cliente com o ID fornecido
    const clientIndex = clients.find(client => client.id === Number(id));
    const id_delete = clientIndex - 1
    if (clientIndex) {
        // Cliente existe, cliente deletado
        clients.splice(id_delete,1)
        res.send("Cliente deletado com sucesso");
    } else {
        res.send("Cliente não encontrado");
    }
});


app.listen(3000, () => {
    console.log("Servidor rodando na porta : 3000")
})