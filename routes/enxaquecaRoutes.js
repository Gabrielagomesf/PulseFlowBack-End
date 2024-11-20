const express = require('express');
const {
    criar,
    buscarPorEmail,

} = require('../controllers/EnxaquecaController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para o CRUD de Enxaqueca
router.post('/', verifyToken, criar); // Criar um novo registro de enxaqueca
router.get('/:email', verifyToken, buscarPorEmail); // Buscar registros de enxaqueca por email

module.exports = router;
