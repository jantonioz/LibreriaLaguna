'use strict';

var Libro = require('../models/libro');
var Imagen = require('../models/imagen_libro');
var Editorial = require('../models/editorial');
var Autor = require('../models/autor');
var Genero = require('../models/genero');
var AutorLibro = require('../models/autor_libro');
var paginate = require('express-paginate');
var dateFormat = require('dateformat');
const utils = require("./Utils");

exports.list_all_libros = function (req, res) {


    Libro.getAllLibros((err, libro) => {
        console.log("libros controller")
        if (err) {
            res.send(err)
        }
        let itemCount = libro.length;
        let pageCount = Math.ceil(itemCount / req.query.limit);

        libro = libro.slice(req.skip, req.skip + req.query.limit);

        for (let i = 0; i < libro.length; i++) {
            if (typeof libro[i].imgdata !== 'undefined' && libro[i].imgdata != null) {
                //console.log(libro[i].imgdata)
                let tempbin = libro[i].imgdata;
                let data64 = Buffer.from(tempbin, 'binary').toString('base64');
                libro[i].imgdata = data64;
                //console.log(libro[i].imgdata);
            }
        }

        res.render('libro/listView',
            {
                title: 'Libros', libros: libro, activeLibros: 'active',
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page),
                actualPage: req.query.page, nombreUsuario: utils.getNombreUsuario(req)
            });
    })
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
    res.render('libro/create', { title: 'Registra un libro', editoriales: eds, autores: auts, generos: gens,
     nombreUsuario: utils.getNombreUsuario(req), ses_id: req.session.user.ses_id});
}

exports.create_a_libro = async (req, res) => {

    if (req.files == null || Object.keys(req.files).length == 0) {
        res.status(400).send('No files were uploaded.');
    }

    // ======= SESION =======
    var sid = req.session.user.ses_id;

    var titulo = req.body.titulo;
    var tituloO = req.body.tituloorig;
    var isbn = req.body.isbn;
    var paginas = req.body.paginas;
    var descripcion = req.body.descripcion;
    var descripcionFis = req.body.descripcion_fisica;
    var editorial_id = req.body.editorial_id;
    var genero_id = req.body.genero_id;
    var autor_id = req.body.autor_id;

    var libro = new Libro(titulo, tituloO, isbn, paginas,
        descripcion, descripcionFis, genero_id, editorial_id);
    

    var id_libro = await libro.save(); // GUARDA EL LIBRO

    var alib = new AutorLibro(autor_id, id_libro);
    var id_autorlibro = await alib.save(); // GUARDA LA RELACION ENTRE AUTOR Y LIBRO

    // GUARDAR LAS IMAGENES DEL LIBRO
    if (id_libro != -1 && id_autorlibro != -1) {
        for (var i = 0; i < Object.keys(req.files.imagen).length; i++) {
            console.log(req.files.imagen[i].name);
            var data = req.files.imagen[i].data;
            var filename = req.files.imgane[i].name;
            var imagen = new Imagen(id_libro, data, filename, sid);
            imagen.save();
        }
    }

    // libro.save((err, insertIdLibro) => {
    //     // GUARDAR IMAGEN
    //     if (!err) {
    //         // LINKEAR AUTOR CON LIBRO
    //         console.log("ID LIBRO: ", insertIdLibro);


    //         alib.save((err, alibres) => {
    //             if (err)
    //                 console.log("ERROR", err);
    //             else
    //                 console.log("OK AUTOR_LIBRO");

    //             // GUARDAR IMAGEN
    //             var imgName = req.files.imagen.name;
    //             var imgdata = req.files.imagen.data;
    //             let img = new Imagen(insertIdLibro, imgdata, imgName);
    //             img.save((err, imgres) => {
    //                 if (!err) {
    //                     res.send("OK");
    //                 }
    //             })
    //         });
    //     }
    // })
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