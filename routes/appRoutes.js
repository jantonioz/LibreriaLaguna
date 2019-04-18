var express = require('express');
var router = express.Router();
var libro = require("../controllers/LibrosController")


// RUTAS [ruta, controlador]
router.get('/', libro.list_all_libros);
router.post('/', libro.create_a_libro);
router.get('/:libroId', libro.get_a_libro);
router.put('/:libroId', libro.update_a_libro);
router.delete('/:libroId', libro.delete_a_libro);


module.exports = router;
