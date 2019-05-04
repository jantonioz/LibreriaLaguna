var express = require('express');
var router = express.Router();
var libro = require("../controllers/LibrosController");
var usuario = require("../controllers/UsuariosController");
var autor = require("../controllers/AutoresController");
var genero = require("../controllers/GenerosController");
var editorial = require("../controllers/EditorialesController");
var busqueda = require("../controllers/BusquedaController");
var proveedor = require("../controllers/ProveedoresController");
//var stockLibro = require("../models/libro");

var modelLibro = require("../models/libro");

/* GET home page. */
router.get('/', (req, res) => {

    modelLibro.getAllLibros((err, libro) => {
        console.log("libros controller")
        if (err) {
            res.send(err)
        }
        else {
            for (let i = 0; i < libro.length; i++) {
                if (typeof libro[i].imgdata !== 'undefined' && libro[i].imgdata != null) {
                    //console.log(libro[i].imgdata)
                    let tempbin = libro[i].imgdata;
                    let data64 = Buffer.from(tempbin, 'binary').toString('base64');
                    libro[i].imgdata = data64;
                }
            }
            res.render('index', { title: 'Libros', libros: libro, activeInicio: 'active', content: "LOS MEJORES LIBROS, EN LA MEJOR TIENDA" })
        }
    });
});

// RUTAS [ruta, controlador]
router.get('/libros/', libro.list_all_libros);

router.get('/libros/d/:libroId', libro.get_a_libro);
//router.put('/libros/d/:libroId', libro.update_a_libro);
router.delete('/libros/:libroId', libro.delete_a_libro);
router.post('/libros/find?:searchName/', libro.find_a_libro);
router.get('/libros/crear/', libro.formCreate_libro);
router.post('/libros/crear/', libro.create_a_libro);
router.get('/libros/e/:libroId', libro.formEditar);
router.post('/libros/update', libro.update_a_libro);

var redirectHome = (req, res, next) => {
    if (req.session && req.session.user && req.cookies.sid) {
        res.redirect('/');
    } else {
        next();
    }
}

var redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.user || !req.cookies.sid) {
        res.redirect('/login');
    } else {
        next();
    }
}

router.get('/usuarios/', usuario.list_all_users);
router.get('/login', redirectHome, usuario.formLogin);
router.post('/login', redirectHome, usuario.login);
router.get('/logout', redirectLogin, usuario.logout);
router.get('/signup', redirectHome, usuario.getRegister);
router.post('/usuarios/register', redirectHome, usuario.create_usr);
router.get('/cuenta', redirectLogin, usuario.userInfo);

router.get('/autores/', autor.list_all_authors);
router.get('/autores/d/:aut_id', autor.listBooksOf);
router.get('/autores/crear', autor.formCrear);
router.post('/autores/crear', autor.create);

router.get('/generos/', genero.list_all_generos);
router.get('/generos/d/:gen_id', genero.getLibrosBy);
router.get('/generos/crear/', genero.formCrear);
router.post('/generos/crear', genero.create);

router.get('/editoriales/', editorial.list_all_editoriales);
router.get('/editoriales/d/:id', editorial.getLibrosBy);
router.get('/editoriales/registrar', editorial.formCrear);
router.post('/editoriales/crear', editorial.create);
router.get('/editoriales/e/:id', editorial.formEditar);
router.post('/editoriales/editar', editorial.editar);

router.post('/find?:busqueda', busqueda.find);

router.get('/proveedores/register', proveedor.register);
router.post('/proveedores/register', proveedor.registerPost);
router.get('/proveedores/', proveedor.listAll);
router.get('/proveedores/e/:prov_id', proveedor.formEditar);
router.post('/proveedores/edit', proveedor.postEditar);

//router.get('/inicio/', libro = new Object());


module.exports = router;
