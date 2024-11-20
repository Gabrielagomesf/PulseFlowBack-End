const mongoose = require('mongoose');

const DiabetesSchema = new mongoose.Schema({
    data: {type: Date},
    nivelGlicemia: {type: Number},
    hora: {type: String},
    email: {type: String},
}, { collection: 'Diabetes' });

module.exports = mongoose.model('Diabetes', DiabetesSchema);