const express = require("express");
const router = express.Router();
const { verifyToken, authorizePaciente } = require("../middlewares/authMiddleware");
const { registroPaciente, loginPaciente, perfilPaciente, atualizarPerfil, atualizarFoto, solicitarRedefinicaoSenha,redefinirSenha } = require("../controllers/pacienteController");

// Rotas do paciente
router.post("/registro", registroPaciente);
router.post("/login", loginPaciente);
router.get("/perfil", verifyToken, authorizePaciente, perfilPaciente);
router.put("/perfil", verifyToken, authorizePaciente, atualizarPerfil);
router.post("/foto", verifyToken, authorizePaciente, atualizarFoto);
router.post("/solicitar-redefinicao-senha", solicitarRedefinicaoSenha);
router.post("/redefinir-senha", redefinirSenha);



module.exports = router;
