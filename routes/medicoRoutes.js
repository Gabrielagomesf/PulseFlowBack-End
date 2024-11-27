const express = require('express');
const {
    register,
    login,
    perfil,
    atualizarPerfil,
    atualizarFoto,
    enviarLinkRedefinicao, // Função para enviar o link de redefinição
    redefinirSenha,        // Função para redefinir a senha
} = require('../controllers/medicoController'); // Certifique-se de que o caminho está correto
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/medico/register', register);
router.post('/medico/login', login);
router.get('/medico/perfil', verifyToken, perfil);
router.put('/medico/atualizar', verifyToken, atualizarPerfil);
router.post('/medico/foto', verifyToken, atualizarFoto);
router.post('/medico/enviar-link', enviarLinkRedefinicao); // Usando diretamente a função desestruturada
router.post('/medico/redefinir-senha', redefinirSenha);    // Usando diretamente a função desestruturada

module.exports = router;
