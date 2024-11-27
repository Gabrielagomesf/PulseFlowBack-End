const mongoose = require('mongoose');

const CicloMenstrualSchema = new mongoose.Schema({
    dataInicial: {type: Date}, 
    dataFinal: {type: Date},   
    email: {type: String},       
},  { collection: 'Ciclo Menstrual' });

module.exports = mongoose.model('CicloMenstrual', CicloMenstrualSchema);