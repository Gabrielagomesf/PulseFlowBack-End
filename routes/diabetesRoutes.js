const express = require('express');
const {
    criar,
    buscarPorEmail,

} = require('../controllers/DiabetesController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas protegidas para o CRUD de Diabetes
router.post('/', verifyToken, criar); 
router.get('/:email', verifyToken, buscarPorEmail); 

module.exports = router;
