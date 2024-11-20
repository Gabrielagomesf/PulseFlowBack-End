const express = require('express');
const {
    criar,
    buscarPorEmail
} = require('../controllers/AsmaController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para o CRUD de Asma
router.post('/', verifyToken, criar); // Criar um novo registro de asma
router.get('/:email', verifyToken, buscarPorEmail); // Buscar registros de asma por email

module.exports = router;
