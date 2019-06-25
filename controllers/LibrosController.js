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
const path = require('path');
const Ejemplar = require('../models/ejemplar');

exports.list_all_libros = async (req, res) => {
    // RETORNA UNA LISTA DE LIBROS CON UNA LISA DE IMAGENES
    let libros = await Libro.getAllLibros();
    //res.json(libros[0].imagenes[0].data);

    let itemCount = libros.length;
    let pageCount = Math.ceil(itemCount / req.query.limit);

    libros = libros.slice(req.skip, req.skip + req.query.limit);

    res.render('libro/listView', {
        title: 'Libros', libros: libros, activeLibros: 'active', pageCount, itemCount,
        pages: paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page),
        actualPage: req.query.page, nombreUsuario: utils.getNombreUsuario(req)
    });
}

exports.formEditar = async (req, res) => {
    var eds = await getEds();
    var auts = await getAuts();
    var gens = await getGens();

    let libro = await Libro.getLibroById(req.params.libroId);
    libro = libro[0];
    if (libro == null) {
        return res.send("BAD");
    }

    libro.fecha_pub = dateFormat(libro.fecha_pub, "yyyy-mm-dd");

    let imgs = await Imagen.getImagesOfLibroID(req.params.libroId);


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
        nombreUsuario: utils.getNombreUsuario(req)
    });
}

exports.create_a_libro = async (req, res) => {
    if (req.files == null || Object.keys(req.files).length == 0) {
        res.status(400).send('No files were uploaded.');
        console.log("no files");
        return;
    }

    // ======= SESION =======
    var sid = req.session.user.ses_id;
    console.log("LIBROS CONTROLLER: sid: ", sid);

    var titulo = req.body.titulo;
    var tituloO = req.body.tituloorig;
    var isbn = req.body.isbn;
    var paginas = req.body.paginas;
    var descripcion = req.body.descripcion;
    var fecha_pub = req.body.fecha_pub;
    var editorial_id = req.body.editorial_id;
    var genero_id = req.body.genero_id;
    var autor_id = req.body.autor_id;

    let libro = new Libro(titulo, tituloO, isbn, paginas, descripcion, fecha_pub, sid, genero_id, editorial_id);
    let id_libro = await libro.save(); // GUARDA EL LIBRO

    var alib = new AutorLibro(autor_id, id_libro, sid);
    var id_autorlibro = await alib.save(); // GUARDA LA RELACION ENTRE AUTOR Y LIBRO


    console.log("Guardado libro y autor libro");
    if (id_libro != -1 && id_autorlibro != -1) {
        for (let index = 0; index < req.files.imagenes.length; index++) {
            console.log(req.files.imagenes[index]);
            let file = req.files.imagenes[index];
            let filename = file.name;
            file.mv("./uploads/" + filename, async (err) => {
                if (!err) {
                    let img = new Imagen(id_libro, "/uploads/" + filename, filename, sid);
                    console.log(await img.save());
                } else {
                    console.log(err);
                }
            })
        }
    } else {
        console.log("NO SE GUARDARON LAS IMAGENES: LIBROSCONTROLLER")
    }

    res.send("OK! :)");
}

exports.find_a_libro = async (req, res) => {
    // RETORNA UNA LISTA DE LIBROS CON UNA LISA DE IMAGENES
    let libros = await Libro.find(req.body.search);
    console.log(libros);
    //res.json(libros[0].imagenes[0].data);

    let itemCount = libros.length;
    let pageCount = Math.ceil(itemCount / req.query.limit);

    libros = libros.slice(req.skip, req.skip + req.query.limit);

    res.render('libro/listView', {
        title: 'Libros', libros: libros, activeLibros: 'active', pageCount, itemCount,
        pages: paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page),
        actualPage: req.query.page, nombreUsuario: utils.getNombreUsuario(req)
    });
}

exports.get_a_libro = async function (req, res) {
    let libro = await Libro.getLibroById(req.params.libroId);

    if (libro == null)
        return res.send("BAD");


    let imgs = await Imagen.getImagesOfLibroID(req.params.libroId);
    if (imgs.length > 0) {
        imgs[0].active = true;
    }

    let ejemplares = await Ejemplar.getAllByLibro(req.params.libroId)
        .catch(reason => {
            console.log("Error ejemplares: ", reason);
        });

    if (ejemplares.length == 0) {
        console.log("Error ejemplares [LibrosController]: ", ejemplares.length); 
        ejemplares = null;
    }
    
    res.render('libro/singleView', {
        title: libro.titulo, libro: libro[0],
        nombreUsuario: utils.getNombreUsuario(req), imagenes: imgs,
        ejemplares: ejemplares
    });
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

    var libro = new Libro(titulo, tituloO, isbn, paginas, descripcion, fecha, req.session.user.ses_id, genero_id, editorial_id, lib_id);

    var oldAutor = await libro.getAutor();

    // UPDATE AUTOR-LIBRO
    var aut_lib = new AutorLibro(oldAutor, lib_id);
    await aut_lib.update(lib_id, autor_id);

    await libro.update().catch((reason) => {
        return res.send("ERROR");
    });

    res.redirect('/libros');
}

exports.delete_form = async (req, res) => {
    let mLibro = await Libro.getLibroById(req.params.libroId).catch((reason) => {
        console.log("error: ", reason);
    });

    let lib_id = mLibro[0].lib_id;

    let imgs = await Imagen.getImagesOfLibroID(req.params.libroId);
    if (imgs.length > 0) {
        imgs[0].active = true;
    }


    res.render('libro/deleteView', { title: 'alerta', libro: mLibro[0], imagenes: imgs });
}

exports.delete_a_libro = async (req, res) => {
    let lib_id = req.body.lib_id;

    var result = await Libro.remove(lib_id).catch((reason) => {
        console.log(reason);
    });

    res.redirect('/libros');
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