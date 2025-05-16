import express from 'express'; // Importa o framework Express
import bodyParser from 'body-parser'; // Importa o body-parser para lidar com dados no corpo das requisições
import { PrismaClient } from './generated/prisma/index.js'; //Importa o PrismaClient
 
const app = express(); // Cria uma instância do Express
const port = 4000; // Porta em que o servidor irá rodar
const prisma = new PrismaClient();
 
app.use(express.json()); // Middleware para interpretar JSON
app.use(bodyParser.json()); // Middleware do body-parser para interpretar JSON (redundante, mas ok)
 
// ------------------ Produtos ------------------
 
// Lista de produtos simulada (mock)
const produtos = [
    { id: 1, nome: 'Água com gás', preco: 3 },
    { id: 2, nome: 'Pipoca', preco: 12 },
    { id: 3, nome: 'Salgado', preco: 8 },
    { id: 4, nome: 'Cachorro-quente', preco: 10 }
];
 
// Rota principal - retorna uma mensagem simples
app.get('/', (req, res) => {
    res.send('Olá, Mundo!'); // Responde com uma mensagem simples
});
 
// Rotas para Produtos
 
// Rota para obter todos os produtos
app.get('/produtos', async (req, res) => {
    const produtos = await prisma.produto.findMany();
    res.json(produtos); // Retorna a lista de produtos em formato JSON
});
 
// Rota para obter um produto específico pelo ID
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id); // Converte o ID da URL para número
    const produto = await prisma.produto.findUnique({ where: {id} }); // Busca o produto pelo ID
 
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' }); // Retorna erro se não encontrado
    }
 
    res.json(produto); // Retorna o produto encontrado
});
 
// Rota para criar um novo produto
app.post('/produtos', (req, res) => {
    const { nome, preco } = req.body; // Captura 'nome' e 'preco' do corpo da requisição
    const id = produtos.length + 1; // Gera novo ID incremental
 
    const novoProduto = { id, nome, preco }; // Cria novo objeto produto
    produtos.push(novoProduto); // Adiciona produto na lista
 
    console.log(novoProduto); // Exibe o produto criado no console
 
    res.status(201).header('Location', `/produtos/${id}`).json(novoProduto); // Retorna o novo produto
});
 
// Rota para atualizar um produto existente
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id); // Converte o ID da URL para número
    const produto = produtos.find(p => p.id === id); // Busca o produto
 
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' }); // Produto não encontrado
    }
 
    const { nome, preco } = req.body; // Captura novos dados
    produto.nome = nome; // Atualiza o nome
    produto.preco = preco; // Atualiza o preço
 
    res.status(200).json({ mensagem: 'Produto atualizado com sucesso', produto }); // Retorna sucesso
});
 
// Rota para deletar um produto existente
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id); // Converte o ID da URL para número
    const index =  produtos.findIndex(p => p.id === id); // Encontra o índice do produto
 
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' }); // Produto não encontrado
    }
 
    produtos.splice(index, 1); // Remove produto da lista
    res.status(200).json({ mensagem: 'Produto removido com sucesso' }); // Retorna sucesso
});

// Iniciamos o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});