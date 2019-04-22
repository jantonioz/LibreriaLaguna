'use strict';

var Libro = require('../models/libro');
var Imagen = require('../models/imagen_libro');
var Editorial = require('../models/editorial');
var Autor = require('../models/autor');
var Genero = require('../models/genero');
var AutorLibro = require('../models/autor_libro');

exports.list_all_libros = function (req, res) {
    Libro.getAllLibros(function (err, libro) {
        console.log("libros controller")
        if (err) {
            res.send(err)
        }
  
        for (let i = 0; i < libro.length; i++) {
            if (typeof libro[i].imgdata !== 'undefined' && libro[i].imgdata != null) {
                console.log(libro[i].imgdata)
                let tempbin = libro[i].imgdata;
                let data64 = Buffer.from(tempbin, 'binary').toString('base64');
                libro[i].imgdata = data64;
                console.log(libro[i].imgdata);
            }
        }

        res.render('libro/listView', { title: 'Libros', libros: libro, activeLibros: 'active' })
    })

}