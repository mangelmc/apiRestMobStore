const mongoose = require('../connect');
const Schema = mongoose.Schema;

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: 'Falta el nombre'
    },
    email: {
        type: String,
        required: 'Falta el email',
        match: /^(([^<>()\[\]\.,;:\s @\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
    password: String,
    telefono: Number,
    log: Number,
    lat: Number,
    avatar: String,
    tipo: String, // vendedor, comprador
    mgusta: {
        type: Number,
        default: 0
    },
    nmgusta: {
        type: Number,
        default: 0
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },

});

const usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = usuario;