const mongoose = require('mongoose');

const HormonalSchema = new mongoose.Schema({
    data: {type: Date},
    hormonio: {type: String},
    dosagem: {type: Number},
    email: {type: String},
},  { collection: 'Hormônios' });

module.exports = mongoose.model('Hormônios', HormonalSchema);