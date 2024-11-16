const express = require('express');
const {
    register,
    login,
    perfil,
    atualizarPerfil,
    atualizarFoto,
} = require('../controllers/medicoController'); // Controladores

const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware de autenticação

const router = express.Router();

// Rotas para médicos
router.post('/medico/register', register); // Registro
router.post('/medico/login', login); // Login
router.get('/medico/perfil', verifyToken, perfil); // Perfil protegido
router.put('/medico/atualizar', verifyToken, atualizarPerfil); // Atualizar perfil
router.post('/medico/foto', verifyToken, atualizarFoto); // Atualizar foto de perfil

module.exports = router;
