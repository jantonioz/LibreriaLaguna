'use strict';

var Autor = require('../models/autor')

exports.list_all_authors = function (req, res) {
    Autor.find(function (err, rows) {
        console.log("Autores Controller")
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('autor/listView', { title: 'Autores', autores: rows })
    })
}


exports.listBooksOf = async (req, res) => {
    let libros = await Autor.booksBy(req.params.aut_id);
    let autor = await Autor.findById(req.params.aut_id);
    let autor_nombre = autor[0].aut_nombre;
    console.log(libros);

    if (libros.length > 0)
        res.render('autor/listLibros', { title: autor_nombre, libros: libros, autor: autor_nombre });
    else
        res.render('autor/listLibros', { title: 'Sin libros por ahora', autor: autor_nombre });
    // let aut_id = req.params.aut_id;
    // Autor.booksBy(aut_id, (err, libro) => {
    //     //console.log("Autores Controller")
    //     if (err) {
    //         res.send(err)
    //     }

    //     for (let i = 0; i < libro.length; i++) {
    //         if (typeof libro[i].imgdata !== 'undefined' && libro[i].imgdata != null) {
    //             //console.log(libro[i].imgdata)
    //             let tempbin = libro[i].imgdata;
    //             let data64 = Buffer.from(tempbin, 'binary').toString('base64');
    //             libro[i].imgdata = data64;
    //             //console.log(libro[i].imgdata);
    //         }
    //     }

    //     res.render('autor/listLibros', { title: libro[0].autor, libros: libro, autor: libro[0].autor })
    //     //res.render('autor/listView', { libros: rows })
    // });
}


exports.formCrear = (req, res) => {
    res.render('autor/create', { title: 'Registra un autor' });
}
var dateFormat = require('dateformat');

exports.create = async (req, res) => {
    let newAutor = new Autor(req.body.nombre, req.body.fnac, req.body.bio, req.session.user.ses_id);
    let insertId = await newAutor.save();
    res.json({id: insertId});
}
