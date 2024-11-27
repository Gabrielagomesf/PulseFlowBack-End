const mongoose = require('mongoose');

const AsmaSchema = new mongoose.Schema({
    dataCrise: {type: Date},
    horaCrise: {type: String},
    tempoDuracaoCrise: {type: String},
    intensidadeCrise: {type: Number},
    horarioMedicao: {type: String},
    email: {type: String},
}, { collection: 'Asmas' });

module.exports = mongoose.model('Asma', AsmaSchema);