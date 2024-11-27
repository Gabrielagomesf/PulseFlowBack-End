const mongoose = require("mongoose");

const MedicoSchema = new mongoose.Schema({
    nomeCompleto: { type: String, required: true },
    cpf: { type: String, unique: true, required: true },
    telefonePessoal: { type: String },
    email: { type: String, unique: true, required: true },
    senha: { type: String, required: true },
    crm: { type: String, required: true },
    areaAtuacao: { type: String },
    enderecoConsultorio1: { type: String },
    enderecoConsultorio2: { type: String },
    telefoneConsultorio: { type: String },
    fotoUrl: { type: String },
});

module.exports = mongoose.model("Medico", MedicoSchema);
