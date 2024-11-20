const express = require('express');
const {
    criar,
    buscarPorEmail
} = require('../controllers/PressaoArterialController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para o CRUD de Pressão Arterial
router.post('/', verifyToken, criar); // Criar registro de pressão arterial
router.get('/:email', verifyToken, buscarPorEmail); // Buscar registros de pressão arterial por email

module.exports = router;
