const mongoose = require('mongoose');

const PressaoArterialSchema = new mongoose.Schema({
    data: {type: Date},
    pressao: {type: Number},
    email: {type: String},
},  { collection: 'Pressão Arterial' });

module.exports = mongoose.model('Pressao Arterial', PressaoArterialSchema);