const express = require('express');
const { 
    register, 
    login, 
    perfil, 
    atualizarPerfil, 
    atualizarFoto 
} = require('../controllers/medicoController');  // Remover a referência ao authController

const { verifyToken } = require('../middlewares/authMiddleware');  // Middleware para verificar o token

const router = express.Router();

// Definindo as rotas
router.post('/medico/register', register);
router.post('/medico/login', login);
router.get('/medico/perfil', verifyToken, perfil);  // Verifica se o token é válido antes de acessar o perfil
router.put('/medico/atualizar', verifyToken, atualizarPerfil);
router.post('/medico/foto', verifyToken, atualizarFoto);
router.get('/perfil', authenticate, getMedicoProfile);

module.exports = router;
