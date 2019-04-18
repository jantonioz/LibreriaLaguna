var express = require('express');
var router = express.Router();
var usr = require("../controllers/UsuariosController")


// RUTAS [ruta, controlador]
router.get('/', usr.list_all_users);
router.post('/', usr.create_usr);


module.exports = router;
