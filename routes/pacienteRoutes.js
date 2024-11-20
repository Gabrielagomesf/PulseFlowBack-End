const express = require("express");
const router = express.Router();
const { verifyToken, authorizePaciente } = require("../middlewares/authMiddleware");
const { registroPaciente, loginPaciente, perfilPaciente, atualizarPerfil, atualizarFoto } = require("../controllers/pacienteController");

// Rotas do paciente
router.post("/registro", registroPaciente);
router.post("/login", loginPaciente);
router.get("/perfil", verifyToken, authorizePaciente, perfilPaciente);
router.put("/perfil", verifyToken, authorizePaciente, atualizarPerfil);
router.post("/foto", verifyToken, authorizePaciente, atualizarFoto);

module.exports = router;
