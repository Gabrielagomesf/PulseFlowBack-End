const mongoose = require('mongoose');

const InsoniaSchema = new mongoose.Schema({
    data: {type: Date},
    horaDormir: {type: String},
    horaAcordar: {type: String},
    quantQueAcordou: {type: Number},
    qualidadeSono: {type: String},
    email: {type: String},
}, { collection: 'Insônia' });

module.exports = mongoose.model('Insonia', InsoniaSchema);