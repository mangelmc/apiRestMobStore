var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lab7', function(req, res, next) {
  const urls =[
    'https://www.chiquipedia.com/imagenes/imagenes-gatos01-498x260.jpg',
    'https://www.chiquipedia.com/imagenes/imagenes-gatos02-498x260.jpg',
    'https://www.chiquipedia.com/imagenes/imagenes-gatos03-498x260.jpg',
    'https://www.chiquipedia.com/imagenes/imagenes-gatos04-498x260.jpg',
    'https://www.chiquipedia.com/imagenes/imagenes-gatos05-498x260.jpg',
    'https://www.chiquipedia.com/imagenes/imagenes-gatos20-498x260.jpg',
    // se puede agregar n urls de imagens
  ];
  const data = [];
  for (let index = 0; index < urls.length; index++) {
      
      let item = {};

      item.descripcion = 'Descripcion ' + index;
      item.title = 'Titulo ' + index;
      item.image = urls[index];    
      data.push(item);
  }
  res.json({
      data
  });

});

module.exports = router;
