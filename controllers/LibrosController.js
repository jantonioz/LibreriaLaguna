'use strict';

const Libro = require('../models/libro');
const Imagen = require('../models/imagen_libro');
const Editorial = require('../models/editorial');
const Autor = require('../models/autor');
const Genero = require('../models/genero');
const AutorLibro = require('../models/autor_libro');
const paginate = require('express-paginate');
const dateFormat = require('dateformat');
const utils = require("./Utils");
const multer = require('multer');
const fs = require('fs');

exports.list_all_libros = async (req, res) => {
    // RETORNA UNA LISTA DE LIBROS CON UNA LISA DE IMAGENES
    let libros = await Libro.getAllLibros();
    //res.json(libros[0].imagenes[0].data);
    let admin = null;
    if (req.session.user)
        admin = req.session.user.isAdmin;

    let itemCount = libros.length;
    let pageCount = Math.ceil(itemCount / req.query.limit);

    libros = libros.slice(req.skip, req.skip + req.query.limit);

    res.render('libro/listView', {
        title: 'Libros', libros: libros, activeLibros: 'active', pageCount, itemCount,
        pages: paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page),
        actualPage: req.query.page, nombreUsuario: utils.getNombreUsuario(req), isAdmin: admin == 1
    });
}

exports.formEditar = async (req, res) => {
    var eds = await getEds();
    var auts = await getAuts();
    var gens = await getGens();
    var libro = await getLibro(req.params.libroId);
    libro.fecha_pub = dateFormat(libro.fecha_pub, "yyyy-mm-dd");
    if (libro.imgdata !== 'undefined' && libro.imgdata !== null)
        libro.imgdata = convertToBase64(libro.imgdata);
    res.render('libro/editView',
        {
            title: 'Editar libro', editoriales: eds, autores: auts,
            generos: gens, libro: libro, lib_id: req.params.libroId,
            nombreUsuario: utils.getNombreUsuario(req)
        });
}



exports.formCreate_libro = async function (req, res) {
    var eds = await getEds();
    var auts = await getAuts();
    var gens = await getGens();
    res.render('libro/create', {
        title: 'Registra un libro', editoriales: eds, autores: auts, generos: gens,
        nombreUsuario: utils.getNombreUsuario(req), ses_id: req.session.user.ses_id
    });
}

exports.create_a_libro = async (req, res) => {
    console.log(req.files);
    for (var i = 0; i < req.files.length; i++) {
        let file = req.files[i].destination + "/" + Date.now() + req.files[i].originalname;
        console.log(file);
    }
    res.send("OK");




    // if (req.files == null || Object.keys(req.files).length == 0) {
    //     res.status(400).send('No files were uploaded.');
    // }

    // // ======= SESION =======
    // var sid = req.session.user.ses_id;

    // var titulo = req.body.titulo;
    // var tituloO = req.body.tituloorig;
    // var isbn = req.body.isbn;
    // var paginas = req.body.paginas;
    // var descripcion = req.body.descripcion;
    // var fecha_pub = req.body.fecha_pub;
    // var editorial_id = req.body.editorial_id;
    // var genero_id = req.body.genero_id;
    // var autor_id = req.body.autor_id;

    // let libro = new Libro(titulo, tituloO, isbn, paginas, descripcion, fecha_pub, sid, genero_id, editorial_id);
    // var id_libro = await libro.save(); // GUARDA EL LIBRO

    // var alib = new AutorLibro(autor_id, id_libro, sid);
    // var id_autorlibro = await alib.save(); // GUARDA LA RELACION ENTRE AUTOR Y LIBRO

    // // GUARDAR LAS IMAGENES DEL LIBRO
    // if (id_libro != -1 && id_autorlibro != -1) {
    //     const tempPath = req.imagenes.






    //     for (var i = 0; i < Object.keys(req.files.imagen).length; i++) {
    //         console.log(req.files.imagen[i].name);
    //         var data = req.files.imagen[i].data;
    //         var filename = req.files.imagen[i].name;
    //         var imagen = new Imagen(id_libro, data, filename, sid);
    //         let img_insertId = await imagen.save();
    //         if (img_insertId == -1) {
    //             res.send("ERROR IMG SAVE");
    //         }
    //     }
    // }
    // res.send("OK! :)");
}

exports.find_a_libro = function (req, res) {

    Libro.find(req.body.search, function (err, libros) {
        if (err)
            console.log(err)

        res.render('libro/listView', { title: 'Libros', libros: libros, activeLibros: 'active', nombreUsuario: utils.getNombreUsuario(req) })
    })
}

exports.get_a_libro = function (req, res) {
    console.log(req.params.libroId)
    Libro.getLibroById(req.params.libroId, function (err, libro) {
        if (err)
            res.send(err)
        //console.log(libro)
        if (libro[0].imgdata != null) {
            let imgdata = libro[0].imgdata
            let imgname = libro[0].filename
            let data64 = Buffer.from(imgdata, 'binary').toString('base64');
            console.log(data64)
            let img = 'data:image/png;base64,' + data64;

            res.render('libro/singleView', { title: libro[0].titulo, libro: libro[0], imgsrc: img, nombreUsuario: utils.getNombreUsuario(req) })
        }
        res.render('libro/singleView', { title: libro[0].titulo, libro: libro[0], nombreUsuario: utils.getNombreUsuario(req) })
    })
}

exports.update_a_libro = async function (req, res) {
    var lib_id = req.body.lib_id;
    var titulo = req.body.titulo;
    var tituloO = req.body.tituloorig;
    var isbn = req.body.isbn;
    var paginas = req.body.paginas;
    var descripcion = req.body.descripcion;
    var fecha = req.body.publicacion;
    var editorial_id = req.body.editorial_id;
    var genero_id = req.body.genero_id;
    var autor_id = req.body.autor_id;

    var libro = new Libro(titulo, tituloO, isbn, paginas,
        descripcion, fecha, genero_id, editorial_id, lib_id);

    var oldAutor = await libro.getAutor();

    // UPDATE AUTOR-LIBRO
    var aut_lib = new AutorLibro(oldAutor, lib_id);
    await aut_lib.update(lib_id, autor_id);

    libro.update((err, result) => {
        if (err)
            res.send(err);
        else {
            res.redirect('/libros/d/' + lib_id);
        }
    });
}

exports.delete_a_libro = function (req, res) {
    Libro.remove(req.params.libroId, function (err, libro) {
        if (err)
            res.send(err)
        res.json(libro)
    })
}


function getGens() {
    return new Promise((resolve, reject) => {
        Genero.find((err, res) => {
            if (!err)
                resolve(res);
        })
    });
}

function getEds() {
    return new Promise((resolve, reject) => {
        Editorial.find(null, (err, res) => {
            if (!err) {
                console.log("EDITORIALES OBTENIDAS");
                resolve(res);
            }
        })
    });
}

function getAuts() {
    return new Promise((resolve, reject) => {
        Autor.find((err, res) => {
            if (!err) {
                console.log("AUTORES OBTENIDOS");
                resolve(res);
            }
        })
    });
}

function getLibro(lib_id) {
    return new Promise((resolve, reject) => {
        Libro.getLibroById(lib_id, (err, res) => {
            if (!err) {
                console.log("LIBRO ENCONTRADO")
                resolve(res[0]);
            }
            else reject(err);
        })
    })
}

function convertToBase64(binaryData) {
    let data64 = Buffer.from(binaryData, 'binary').toString('base64');
    return data64;
}