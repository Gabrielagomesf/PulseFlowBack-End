const express = require('express');
const {
    register,
    login,
    perfil,
    atualizarPerfil,
    atualizarFoto,
} = require('../controllers/medicoController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/medico/register', register);
router.post('/medico/login', login);
router.get('/medico/perfil', verifyToken, perfil);
router.put('/medico/atualizar', verifyToken, atualizarPerfil);
router.post('/medico/foto', verifyToken, atualizarFoto);

module.exports = router;