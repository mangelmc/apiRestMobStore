var express = require('express');
var router = express.Router();


const Cita = require('../../database/models/cita');


/* Agregar nuevo cita */
router.post("/", (req, res) => {
    
    let fields = req.body
    var datos = {         
        vendedor : fields.file.vendedor,
        comprador : fields.file.comprador,
        producto: fields.producto,
        cantidad : fields.cantidad,
        estado : 'por confirmar',
        fechaCita : fields.fechaCita,
        horaCita : fields.horaCita,
        log : fields.log,
        lat : fields.lat,

    };
    
    var modelCita = new Cita(datos);
    modelCita.save()        
        .then(result => {
        res.status(201).json({message: 'Se creo una nueva cita',result});
        })
        .catch(err => {
        res.status(500).json({error:err.message})
        });
});

/* Leer una Cita */
router.get('/:id', function (req, res, next) {
    let idCita = req.params.id;
    Cita.findOne({_id: idCita}).select('-__v').exec().then(docs => {
        if(doc == null){
            return res.status(404).json({message: 'No Existe el recusro buscado'});
        }
        res.json(doc);
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* listar Citas de un usuario */
router.get('/usuario/:id', function (req, res, next) {
    let idUser = req.params.id;
    Cita.find().or([{comprador:idUser},{vendedor:idUser}]).select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No hay Citas'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* Actualizar cita */
router.patch('/:id', function (req, res) {
    let idCita = req.params.id;
    if (req.body.texto == undefined) {
        return res.status(400).json({
            error: "el texto no puede estar vacio"
        })
    }
    const datos = {texto: req.body.texto};

    Cita.updateOne({_id: idCita}, datos).exec()
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
/*Eliminar cita */
router.delete('/:id', function (req, res) {
    let idCita = req.params.id;
    Cita.deleteOne({_id: idCita}).exec()
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