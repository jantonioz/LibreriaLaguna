var express = require('express');
var router = express.Router();

var libro = require("../controllers/LibrosController");
var usuario = require("../controllers/UsuariosController");
var autor = require("../controllers/AutoresController");
var genero = require("../controllers/GenerosController");
var editorial = require("../controllers/EditorialesController");
var busqueda = require("../controllers/BusquedaController");
var proveedor = require("../controllers/ProveedoresController");
const utils = require("../controllers/Utils");
const lote = require("../controllers/LotesController");
/* var stockLibro = require("../models/libro"); */

var modelLibro = require("../models/libro");
var mUsuario = require("../models/usuario");

/* GET home page. */
router.get('/', async (req, res) => {
    // RETORNA UNA LISTA DE LIBROS CON UNA LISA DE IMAGENES
    let libros = await modelLibro.getAllLibros();
    console.log(libros);

    let admin = null;
    if (req.session.user)
        admin = req.session.user.isAdmin;

    res.render('index', {
        title: 'Libros', libros: libros, activeInicio: 'active',
        content: "LOS MEJORES LIBROS, EN LA MEJOR TIENDA",
        nombreUsuario: utils.getNombreUsuario(req), isAdmin: admin == 1
    });
});


var autoMiddleware = (req, res, next) => {
    next();
}

var redirectHome = (req, res, next) => {
    if (req.session && req.session.user && req.cookies.sid) {
        res.redirect('/');
    } else {
        next();
    }
}

var redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.user || !req.cookies.sid) {
        req.gobackTo = req.originalUrl;
        res.render('usuario/login', { title: 'Login usuario', gobackTo: req.originalUrl });
        return;
    } else {
        next();
    }
}

var checkAdmin = (req, res, next) => {
    console.log("CHECK ADMIN");
    if (req.session == null || req.session.user == null || req.cookies.sid == null) {
        console.log("USUARIO: ", req.session.user);
        console.log(req.originalUrl);
        req.gobackTo = req.originalUrl;
        //res.redirect('/login');
        res.render('usuario/login', { title: 'Login usuario', gobackTo: req.originalUrl });
        return;
    }
    let username = req.session.user.username;
    let password = req.session.user.password;
    mUsuario.verifyAdmin(username, password, (result) => {
        if (result == true) {
            console.log("NEXT");
            next();
        } else if (result) {
            console.log("NOT ADMIN")
            res.redirect('/login');
        }
    });
}

// RUTAS [ruta, controlador]
router.get('/libros/', libro.list_all_libros);

// ==== LIBROS ====
router.get('/libros/d/:libroId', autoMiddleware, libro.get_a_libro);
router.post('/libros/find?:searchName/', autoMiddleware, libro.find_a_libro);
router.get('/libros/crear/', checkAdmin, libro.formCreate_libro);
router.post('/libros/crear/', /*uploadLibros.array('imagenes', 3),*/ libro.create_a_libro);
router.get('/libros/e/:libroId', checkAdmin, libro.formEditar);
router.post('/libros/update', checkAdmin, libro.update_a_libro);

// ==== USUARIOS ====
router.get('/usuarios/', usuario.list_all_users);
router.get('/login', redirectHome, usuario.formLogin);
router.post('/login', redirectHome, usuario.login);
router.get('/logout', redirectLogin, usuario.logout);
router.get('/registro', redirectHome, usuario.getRegister);
router.get('/usuarios/register/', checkAdmin, usuario.getRegister);
router.post('/usuarios/register', redirectHome, usuario.create_usr);
router.get('/cuenta', redirectLogin, usuario.userInfo);
router.get('/admin/add', checkAdmin, usuario.getRegister);

// ==== AUTORES ====
router.get('/autores/', autoMiddleware, autor.list_all_authors);
router.get('/autores/d/:aut_id', autoMiddleware, autor.listBooksOf);
router.get('/autores/crear', checkAdmin, autor.formCrear);
router.post('/autores/crear', checkAdmin, autor.create);

// ==== GENEROS ====
router.get('/generos/', autoMiddleware, genero.list_all_generos);
router.get('/generos/d/:gen_id', autoMiddleware, genero.getLibrosBy);
router.get('/generos/crear/', checkAdmin, genero.formCrear);
router.post('/generos/crear', checkAdmin, genero.create);

// ==== EDITORIALES ====
router.get('/editoriales/', autoMiddleware, editorial.list_all_editoriales);
router.get('/editoriales/d/:id', autoMiddleware, editorial.getLibrosBy);
router.get('/editoriales/registrar', checkAdmin, editorial.formCrear);
router.post('/editoriales/crear', checkAdmin, editorial.create);
router.get('/editoriales/e/:id', checkAdmin, editorial.formEditar);
router.post('/editoriales/editar', checkAdmin, editorial.editar);

// ==== BUSQUEDA ====
router.post('/find?:busqueda', busqueda.find);

// ==== PROVEEDORES ====
router.get('/proveedores/register', checkAdmin, proveedor.register);
router.post('/proveedores/register', checkAdmin, proveedor.registerPost);
router.get('/proveedores/', autoMiddleware, proveedor.listAll);
router.get('/proveedores/e/:prov_id', checkAdmin, proveedor.formEditar);
router.post('/proveedores/edit', checkAdmin, proveedor.postEditar);

// ==== LOTES ====
router.get('/lotes/', checkAdmin, lote.viewAll);
router.get('/lotes/d/:id', checkAdmin, lote.detalleView);
router.get('/lotes/add/', checkAdmin, lote.addView);
router.post('/lotes/add/', checkAdmin, lote.addPost);
// router.get('/lotes/e/:id', checkAdmin, lote.editView);
// router.post('/lotes/e/', checkAdmin, lote.editPost);

module.exports = router;