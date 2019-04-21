'use strict';

var Libro = require('../models/libro');
var Imagen = require('../models/imagen_libro');
var Editorial = require('../models/editoriales');
var Autor = require('../models/autor');
var Genero = require('../models/genero');
var AutorLibro = require('../models/autor_libro');

exports.list_all_libros = function (req, res) {
    Libro.getAllLibros(function (err, libro) {
        console.log("libros controller")
        if (err) {
            res.send(err)
        }
        console.log('res', libro)
        console.log(libro.length)
        res.render('libro/listView', {title: 'Libros', libros: libro, activeLibros: 'active' })
    })

}

exports.formCreate_libro = async function (req, res) {
    var eds = await getEds();
    var auts = await getAuts();
    var gens = await getGens();
    res.render('libro/create', {title: 'Registra un libro', editoriales: eds, autores: auts, generos: gens });
}

exports.create_a_libro = (req, res) => {

    if (req.files == null || Object.keys(req.files).length == 0) {
        res.status(400).send('No files were uploaded.');
    }

    //res.json(req.body);

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

    libro.save((err, insertIdLibro) => {
        // GUARDAR IMAGEN
        if (!err) {
            // LINKEAR AUTOR CON LIBRO
            console.log("ID LIBRO: ", insertIdLibro);

            var alib = new AutorLibro(autor_id, insertIdLibro);
            alib.save((err, alibres) => {
                if (err)
                    console.log("ERROR", err);
                else
                    console.log("OK AUTOR_LIBRO");

                // GUARDAR IMAGEN
                var imgName = req.files.imagen.name;
                var imgdata = req.files.imagen.data;
                let img = new Imagen(insertIdLibro, imgdata, imgName);
                img.save((err, imgres) => {
                    if (!err) {
                        res.send("OK");
                    }
                })
            });
        }
    })

    // let imgLibro = new imagenlibro(3, imgdata, imgName)
    // imagenlibro.create(imgLibro, (err, imgres) => {
    //     if (err)
    //         res.send(err)
    //     res.json(imgres)
    // })

}

exports.find_a_libro = function (req, res) {

    Libro.find(req.body.search, function (err, libros) {
        if (err)
            console.log(err)

        console.log(libros)
        res.render('libro/listView', {title: 'Libros', libros: libros, activeLibros: 'active' })
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

            res.render('libro/singleView', {title: libro[0].titulo, libro: libro[0], imgsrc: img })
        }
        res.render('libro/singleView', {title: libro[0].titulo, libro: libro[0] })
    })
}

exports.update_a_libro = function (req, res) {
    Libro.updateTitleById(req.params.libroId, new Libro(req.body), function (err, libro) {
        if (err)
            res.send(err)
        res.json(libro)
    })
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
        Autor.find(null, (err, res) => {
            if (!err) {
                console.log("AUTORES OBTENIDOS");
                resolve(res);
            }
        })
    });
}