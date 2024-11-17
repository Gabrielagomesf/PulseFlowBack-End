const mongoose = require('mongoose');

// Definição do modelo Paciente
const pacienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
    },
    dataNascimento: {
        type: Date, // Campo de data
        required: [true, 'A data de nascimento é obrigatória'],
    },
    cpf: {
        type: String,
        required: [true, 'O CPF é obrigatório'],
        unique: true,
    },
    telefone: {
        type: String,
        required: [true, 'O telefone é obrigatório'],
    },
    endereco: {
        type: String,
        required: [true, 'O endereço é obrigatório'],
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor insira um email válido'],
    },
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
    },
}, {
    timestamps: true,
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
