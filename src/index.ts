import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from './generated/prisma/index.js';

const app = express();
const port = 4000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(bodyParser.json());



// Rota principal
app.get('/', (req, res) => {
    res.send('Olá, Mundo!');
});


app.get('/ingressos', async (req, res) => {
    const ingressos = await prisma.ingresso.findMany();
    res.json(ingressos);
});


app.get('/ingressos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const ingresso = await prisma.ingresso.findUnique({ where: { id } });

    if (!ingresso) {
        return res.status(404).json({ mensagem: 'Ingresso não encontrado' });
    }

    res.json(ingresso);
});

// Rota para criar um novo ingresso
app.post('/ingressos', async (req, res) => {
    const { evento, valor, tipo } = req.body;

    const novoIngresso = await prisma.ingresso.create({
        data: {
            evento,
            valor,
            tipo,
        },
    });

    res.status(201).header('Location', `/ingressos/${novoIngresso.id}`).json(novoIngresso);
});


app.put('/ingressos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { evento, valor, tipo } = req.body;

    const ingresso = await prisma.ingresso.findUnique({ where: { id } });

    if (!ingresso) {
        return res.status(404).json({ mensagem: 'Ingresso não encontrado' });
    }

    const ingressoAtualizado = await prisma.ingresso.update({
        where: { id },
        data: { evento, valor, tipo },
    });

    res.status(200).json({ mensagem: 'Ingresso atualizado com sucesso', ingresso: ingressoAtualizado });
});


app.delete('/ingressos/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const ingresso = await prisma.ingresso.findUnique({ where: { id } });

    if (!ingresso) {
        return res.status(404).json({ mensagem: 'Ingresso não encontrado' });
    }

    await prisma.ingresso.delete({ where: { id } });

    res.status(200).json({ mensagem: 'Ingresso removido com sucesso' });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});