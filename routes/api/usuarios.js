var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;
const sha1 = require('sha1');

const Usuario = require('../../database/models/usuario');
const Imagen = require('../../database/models/imagen');



const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        try {
            fs.statSync('./uploads/');
        } catch (e) {
            fs.mkdirSync('./uploads/');
        }
        cb(null, './uploads/');
    },
    filename: (res, file, cb) => {
        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
        return cb(null, true);
    }
    return cb(new Error('Solo se admiten imagenes png, jpg y jpeg'));
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1 
    }
}).single('imagen');
/* 

*/
/* Agregar avatar a usuario */
router.post("/imagen/:id", (req, res) => {
    console.log(req.body);
    upload(req, res, (error) => {
      if(error){
        return res.status(500).json({
          "error" : error.message
  
        });
      }else{
        if (req.file == undefined) {
          return res.status(500).json({
            "error" : 'No se recibio la imagen'
    
          });
        }
        var img = {         
          name : req.file.originalname,
          idUsuario: req.params.id,
          path : req.file.path,
        };
        var modelImagen = new Imagen(img);
        modelImagen.save()
          .then( (result) => {
            return Usuario.findByIdAndUpdate(req.params.id,{avatar:'/api/usuarios/imagen/' + result._id}).exec()
          })
          .then(result => {
            res.status(200).json(result);
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });
      }
    });
  });


//obtener la imagen
//en la url se envia con la id de la foto o imagen registrada

router.get("/imagen/:id", (req, res) => { 
  Imagen.findOne({_id: req.params.id}).exec()
  .then(doc => {
    
    if(doc){
      //regresamos la imagen deseada
      
      var img = fs.readFileSync("./" + doc.path);
      res.contentType('image/jpeg');
      if (path.extname(doc.path) == '.png') {
        res.contentType('image/png');
      }
      res.status(200).send(img);
      //regresamos la imagen deseada
    }
    else{
      res.status(424).json({
        "error": "La solicitud falló, ,la imagen fue eliminada"
      });
      return;
    }
  })
  .catch(err => {
    res.status(500).json({
        error: err.message
    })
  });
});
router.get("/imagen", (req, res) => { 
  Imagen.find().exec()
  .then(docs => {
    res.json({
      data: docs
    });
  })
  .catch(err => {
    res.status(500).json({
        error: err.message
    })
  });
});

//>>>>>>>>>>>>>>>>>>>>
  router.get('/', function (req, res, next) {
  Usuario.find().select('-__v -password -fechaRegistro').exec().then(docs => {
    if(docs.length == 0){
      return res.status(404).json({message: 'no existen usuarios registrados'});
    }
    res.json(docs);
  })
  .catch(err => {
      res.status(500).json({
          error: err.message
      })
  });
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>
/* Registro de usuarios */
router.post('/', function (req, res, next) {
    //verificar que no exista mismo correo
    Usuario.findOne({email:req.body.email})
    .exec()
    .then(doc => {
      //console.log(doc);
      
      if (doc != null) {
        return res.status(401).json({error:'el correo ya esta en uso'});
      }
      //console.log('true');
      
      const datos = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        log: req.body.log,
        lat: req.body.lat,
        tipo: req.body.tipo,//el tipo de usuario
      };
      if (req.body.password == undefined || req.body.password == '') {
        return res.status(401).json({
          error: 'Falta la contraseña'
        })
      }    
      datos.password = sha1(req.body.password);
      //console.log(datos);    
      var modelUsuario = new Usuario(datos);
      return modelUsuario.save()
               
    }).then((result) => {
      res.json({
          message: "Registro exitoso",
          result
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
});

router.post('/login', (req, res, next) => {
    Usuario.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Usuario inexistente"
                });
            }
            if (req.body.password != user[0].password) {
                return res.status(401).json({
                    message: "Fallo al autenticar, verifique los datos"
                });
            }else{
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                    },
                    process.env.JWT_KEY || 'secret321', {
                        expiresIn: "1h"
                    });
                
                return res.status(200).json({
                    message: "Acceso correcto",
                    token: token
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:id', function (req, res, next) {
    let idUsuario = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
      if (key != 'email') {
        datos[key] = req.body[key];  
      }  
    });
    console.log(datos);
    Usuario.findOneAndUpdate({_id: idUsuario}, datos).exec()
        .then(result => {
            res.json({
                message: "Datos actualizados"
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});



router.get('/lab7', function(req, res, next) {
  
    const data = [];
    for (let index = 0; index < 50; index++) {
        
        let item = {};

        item.descripcion = 'Descripcion ' + index;
        item.title = 'Titulo ' + index;
        item.image = 'https://s3-us-west-2.amazonaws.com/devcodepro/media/blog/la-fundacion-de-google.png';    
        data.push(item);
    }
    res.json({
        data
    });

});

module.exports = router;