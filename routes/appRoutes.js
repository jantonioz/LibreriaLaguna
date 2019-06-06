const express = require('express');
const router = express.Router();

const libro = require("../controllers/LibrosController");
const usuario = require("../controllers/UsuariosController");
const autor = require("../controllers/AutoresController");
const genero = require("../controllers/GenerosController");
const editorial = require("../controllers/EditorialesController");
const busqueda = require("../controllers/BusquedaController");
const proveedor = require("../controllers/ProveedoresController");
const utils = require("../controllers/Utils");
const lote = require("../controllers/LotesController");
const middleware = require('../middleware/middleware');
const mTipoE = require('../models/tipo_ejemplar');


/* var stockLibro = require("../models/libro"); */

var modelLibro = require("../models/libro");
var mUsuario = require("../models/usuario");



/* GET home page. */
router.get('/', async (req, res) => {
    // RETORNA UNA LISTA DE LIBROS CON UNA LISA DE IMAGENES
    let libros = await modelLibro.getAllLibros();

    res.render('index', {
        title: 'Libros', libros: libros, activeInicio: 'active',
        content: "LOS MEJORES LIBROS, EN LA MEJOR TIENDA",
        nombreUsuario: utils.getNombreUsuario(req)
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

function rolIs(req, rolnameToCheck) {
    if (!req.session)
        return false;
    if (!req.session.user)
        return false;
    return (String.prototype.toLowerCase.apply(req.session.user.nombreRol) == rolnameToCheck);
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

    
    if (rolIs(req, 'sysadmin')) {
        res.locals.isAdmin = '1';
        next();
    }
}

var checkProv = (req, res, next) => {
    console.log("CHECK PROV");
    if (req.session == null || req.session.user == null || req.cookies.sid == null) {
        console.log("USUARIO: ", req.session.user);
        console.log(req.originalUrl);
        req.gobackTo = req.originalUrl;
        //res.redirect('/login');
        res.render('usuario/login', { title: 'Login usuario', gobackTo: req.originalUrl });
        return;
    }

    if (rolIs(req, 'stockadmin') || rolIs('sysadmin')) {
        res.locals.isAdmin = true;
        next();
    }
}

var checkBookAdmin = (req, res, next) => {
    console.log("CHECK Book");
    if (req.session == null || req.session.user == null || req.cookies.sid == null) {
        console.log("USUARIO: ", req.session.user);
        console.log(req.originalUrl);
        req.gobackTo = req.originalUrl;
        //res.redirect('/login');
        res.render('usuario/login', { title: 'Login usuario', gobackTo: req.originalUrl });
        return;
    }

    
    if (rolIs(req, 'bookadmin') || rolIs(req, 'sysadmin')) {
        next();
        res.locals.isAdmin = true;
    }
}

// ==== LIBROS ====
router.get('/libros/', libro.list_all_libros);
router.get('/libros/d/:libroId', libro.get_a_libro);
router.post('/libros/find', libro.find_a_libro);
router.get('/libros/crear/', checkBookAdmin, libro.formCreate_libro);
router.post('/libros/crear/', checkBookAdmin, libro.create_a_libro);
router.get('/libros/e/:libroId', checkBookAdmin, libro.formEditar);
router.post('/libros/update', checkBookAdmin, libro.update_a_libro);
router.get('/libros/delete/:libroId', checkBookAdmin, libro.delete_form);
router.post('/libros/delete', checkBookAdmin, libro.delete_a_libro);

// ==== USUARIOS ====
router.get('/usuarios/', usuario.list_all_users);
router.get('/login', redirectHome, usuario.formLogin);
router.post('/login', redirectHome, usuario.login);
router.get('/logout', redirectLogin, usuario.logout);
router.get('/registro', redirectHome, usuario.getRegister);
router.get('/usuarios/admin/register', checkAdmin, usuario.getRegisterWAdmin);
router.post('/usuarios/admin/register', checkAdmin, usuario.create_usrWAdmin);
router.get('/cuenta', redirectLogin, usuario.userInfo);
router.get('/admin/add', checkAdmin, usuario.getRegister);
router.post('/addCarrito', redirectLogin, usuario.addCarrito);

router.get('/cuenta/password', redirectLogin, usuario.formPassword);
router.post('/cuenta/password', redirectLogin, usuario.changePassword);
router.get('/cuenta/username', redirectLogin, usuario.formUsername);
router.post('/cuenta/username', redirectLogin, usuario.changeUsername);
router.get('/cuenta/name', redirectLogin, usuario.formNombre);
router.post('/cuenta/name', redirectLogin, usuario.changeNombre);
router.get('/cuenta/email', redirectLogin, usuario.formEmail);
router.post('/cuenta/email', redirectLogin, usuario.changeEmail);
router.get('/cuenta/fnac', redirectLogin, usuario.formFnac);
router.post('/cuenta/fnac', redirectLogin, usuario.changeFnac);

router.get('/cuenta/direccion', redirectLogin, usuario.formDireccion);
router.post('/cuenta/direccion', redirectLogin, usuario.changeDir);

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

router.get('/tipos/add', checkAdmin, (req, res) => {
    res.render('tipos/add');
});
router.post('/tipos/add', checkAdmin, async (req, res) => {
    let descripcion = req.body.descripcion;
    let dimensiones = req.body.dimensiones;
    let ses_id = req.session.user.ses_id;
    let nTipo = new mTipoE(descripcion, dimensiones, ses_id);
    await nTipo.save()
    console.log(nTipo);
    res.redirect('/lotes/add');
});

module.exports = router;