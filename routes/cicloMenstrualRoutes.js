const express = require('express');
const {
    criar,
    buscarPorEmail
} = require('../controllers/CicloMenstrualController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para o CRUD de Ciclo Menstrual
router.post('/', verifyToken, criar); // Criar um novo ciclo menstrual
router.get('/:email', verifyToken, buscarPorEmail); // Buscar ciclos menstruais por email

module.exports = router;
