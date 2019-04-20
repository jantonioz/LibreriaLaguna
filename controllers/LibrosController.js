'use strict';

var Libro = require('../models/libro')
var imagenlibro = require('../models/imagen_libro')

exports.list_all_libros = function (req, res) {
    Libro.getAllLibros(function (err, libro) {
        console.log("libros controller")
        if (err) {
            res.send(err)
        }
        console.log('res', libro)

        res.render('libro/listView', { libros: libro, activeLibros: 'active' })
    })
}

exports.formCreate_libro = function (req, res) {
    var editoriales =
    {
        editorial1: { id: 1, nombre: "NoBooks" },
        editorial2: { id: 2, nombre: "Gnome Press" }
    }

    var generos = {
        genero1: {id: 1, nombre: "Novela"},
        genero2: {id: 2, nombre: "Ciencia Ficcion"}
    }

    res.render('libro/create', { editoriales: editoriales, generos: generos });
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
 


    var imgName = req.files.imagen.name;
    var imgdata = req.files.imagen.data;
    
    // let mLibro = new Libro(titulo, tituloO, isbn, paginas, descripcion, descripcionFis, genero_id ,editorial_id);
    // Libro.createLibro(mLibro, (err, insertId)=>{
    //     if(err)
    //         res.send(err)
    //     res.json(libro)
        
    // })

    
    let imgLibro = new imagenlibro(3, imgdata, imgName)
    imagenlibro.create(imgLibro, (err, imgres)=>{
        if (err)
            res.send(err)
        res.json(imgres)
    })
    
}

exports.find_a_libro = function (req, res) {

    Libro.find(req.body.search, function (err, libros) {
        if (err)
            console.log(err)

        console.log(libros)
        res.render('libro/listView', { libros: libros, activeLibros: 'active' })
    })
}

exports.get_a_libro = function (req, res) {
    console.log(req.params.libroId)
    Libro.getLibroById(req.params.libroId, function (err, libro) {
        if (err)
            res.send(err)

        console.log(libro)
        res.render('libro/singleView', { libro: libro[0] })
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