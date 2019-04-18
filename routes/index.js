var express = require('express');
var router = express.Router();

var mysql = require('mysql')


/* GET home page. */
router.get('/', function (req, res, next) {

  console.log('index')
  res.render('index', { titulo: "Libreria laguna", content: "LOS MEJORES LIBROS, EN LA MEJOR TIENDA" })
});

module.exports = router;
