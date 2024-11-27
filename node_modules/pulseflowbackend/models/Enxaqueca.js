const mongoose = require('mongoose');

const EnxaquecaSchema = new mongoose.Schema({
    data: {type: Date},
    hora: {type: String},
    tempoDuracao: {type: Number},
    intensidadeDor: {type: Number},
    email: {type: String},
}, { collection: 'Enxaquecas' });

module.exports = mongoose.model('Enxaquecas', EnxaquecaSchema);