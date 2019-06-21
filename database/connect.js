const mongoose = require('mongoose');

mongoose.connect("mongodb://172.17.0.1:27017/apiRestMobStore", {
    useNewUrlParser: true
}).then(() => {
    console.log('conexion a mongodb exitosa');
}).catch(err => {
    console.log('Error en la conexion hacia mongo DB');
});
module.exports = mongoose;