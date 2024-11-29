const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    resetToken: { type: String },
    tokenExpiracao: { type: Date },
});

module.exports = mongoose.model("Paciente", pacienteSchema);
