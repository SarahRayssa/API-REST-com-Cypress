// Importando os módulos necessários
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicializando o app Express
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
app.use(cors()); // Permite requisições de diferentes origens

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://srayssa:sarah1801@livroapi.kkb69.mongodb.net/?retryWrites=true&w=majority&appName=LivroAPI')
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definição do modelo Livro
const LivroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editora: { type: String, required: true },
    anoPublicacao: { type: Number, required: true },
    numeroPaginas: { type: Number, required: true }
});
const Livro = mongoose.model('Livro', LivroSchema);

// Rota para cadastrar um novo livro
app.post('/livros', async (req, res) => {
    try {
        const { titulo, autor, editora, anoPublicacao, numeroPaginas } = req.body;

        if(!titulo || !autor || !editora || !anoPublicacao || !numeroPaginas) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios'});
        }

        const duplicado = await Livro.findOne({titulo: titulo})

        if (duplicado) {
            return res.status(409).json({erro: 'O título do livro já foi cadastrado.'})
        }

        const novoLivro = new Livro({ titulo, autor, editora, anoPublicacao, numeroPaginas });
        await novoLivro.save();
        res.status(400).json(novoLivro);

    } catch (error) {
        res.status(400).json({ error: 'Erro ao cadastrar o livro. Verifique os dados.' });
    }
});

// Rota para listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os livros.' });
    }
});

// Rota para buscar um livro pelo ID
app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);
        if (!livro) return res.status(404).json({ error: 'Livro não encontrado.' });
        res.json(livro);
    } catch (error) {
        res.status(400).json({ error: 'ID inválido.' });
    }
});

// Rota para deletar um livro pelo ID
app.delete('/livros/:id', async (req, res) => {
    try {
        const livroRemovido = await Livro.findByIdAndDelete(req.params.id);
        if (!livroRemovido) return res.status(404).json({ error: 'Livro não encontrado.' });
        res.json({ message: 'Livro removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o livro.' });
    }
});

// Configuração do servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
