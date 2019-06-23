var express = require('express');
var router = express.Router();


const Mensaje = require('../../database/models/mensaje');


/* Agregar nuevo mensaje */
router.post("/", (req, res) => {
    
    let fields = req.body
    var datos = {         
        vendedor : fields.file.vendedor,
        comprador: fields.comprador,
        texto : fields.texto,
    };
    var modelMensaje = new Mensaje(datos);
    modelMensaje.save()        
        .then(result => {
        res.status(201).json({message: 'Se envio el mensaje',result});
        })
        .catch(err => {
        res.status(500).json({error:err.message})
        });
});
/* listar Mensajes de un chat */
router.get('/', function (req, res, next) {
    let query = req.query;
    if(query.vendedor == undefined || query.comprador == undefined){
        return res.status(400).json({
            error: "Falta informacion del comprador/vendedor"
        })
    }
    let criterios = {
        vendedor: query.vendedor,
        comprador: query.comprador
    };
    
    
    Mensaje.find(criterios).select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No hay Mensajes'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* Actualizar mensaje */
router.patch('/:id', function (req, res) {
    let idMensaje = req.params.id;
    if (req.body.texto == undefined) {
        return res.status(400).json({
            error: "el texto no puede estar vacio"
        })
    }
    const datos = {texto: req.body.texto};

    Mensaje.updateOne({_id: idMensaje}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el recurso';
            }
            if (result.ok == 1 && result.n == 1 && result.nModified == 0) {
                message = 'Se recibieron los mismos datos antiguos,no se realizaron cambios';
            }
            res.json({
                message,
                result
            });
            
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
/*Eliminar mensaje */
router.delete('/:id', function (req, res) {
    let idMensaje = req.params.id;
    Mensaje.deleteOne({_id: idMensaje}).exec()
        .then(result => {
            let message = 'Se elimino el recurso';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el recurso';
            }
            res.json({
                message,
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;