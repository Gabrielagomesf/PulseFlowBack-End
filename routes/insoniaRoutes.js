const express = require('express');
const {
    criar,
    buscarPorEmail
} = require('../controllers/InsoniaController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para o CRUD de Insônia
router.post('/', verifyToken, criar); // Criar um novo registro de insônia
router.get('/:email', verifyToken, buscarPorEmail); // Buscar registros de insônia por email

module.exports = router;
