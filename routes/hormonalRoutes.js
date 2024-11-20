const express = require('express');
const {
    criar,
    buscarPorEmail
} = require('../controllers/HormonalController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para Hormonal
router.post('/', verifyToken, criar); // Criar registro hormonal
router.get('/:email', verifyToken, buscarPorEmail); // Buscar registros hormonais por email

module.exports = router;
