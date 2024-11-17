const express = require('express');
const { registerPaciente } = require('../controllers/pacienteController');
const router = express.Router();

// Rota de registro de paciente
router.post('/registro', registerPaciente);

module.exports = router;
