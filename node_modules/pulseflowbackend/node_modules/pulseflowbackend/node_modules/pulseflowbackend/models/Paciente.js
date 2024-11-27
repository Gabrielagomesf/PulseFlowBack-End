const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true   // Garantir que o CPF seja único
    },
    telefone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    }
});

const Paciente = mongoose.model("Paciente", pacienteSchema);

module.exports = Paciente;
