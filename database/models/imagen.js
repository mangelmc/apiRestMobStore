

const mongoose = require('../connect');
const Schema = mongoose.Schema;

const imagenSchema = Schema({
    name : String,
    idUsuario: String,
    physicalpath : String,
    relativepath : String,   
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const imagen = mongoose.model('Imagen', imagenSchema);

module.exports = cita;