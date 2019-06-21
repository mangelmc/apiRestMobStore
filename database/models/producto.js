const mongoose = require('../connect');
const Schema = mongoose.Schema;

const productoSchema = Schema({

    vendedor: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info del vendedor'
    },
    descripcion: String,
    precio: {
        type: Number,
        require:'Producto debe tener un precio',
        min:0.50
    },
    stock:{
        type:Number,
        default:0,
        min:0
    },
    estado:{
        type: String,
        default: 'agotado',        
        enum:['disponible','no disponible','agotado'],
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },
    foto: String
});

const producto = mongoose.model('Producto', productoSchema);

module.exports = producto;