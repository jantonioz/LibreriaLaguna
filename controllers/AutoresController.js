'use strict';

var Autor = require('../models/autor')

exports.list_all_authors = function (req, res) {
    Autor.find(null, function (err, rows) {
        console.log("Autores Controller")
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('autor/listView', { title: 'Autores', autores: rows })
    })
}


exports.listBooksOf = (req, res) => {
    let aut_id = req.params.aut_id;
    Autor.booksBy(aut_id, (err, libro) => {
        //console.log("Autores Controller")
        if (err) {
            res.send(err)
        }

        for (let i = 0; i < libro.length; i++) {
            if (typeof libro[i].imgdata !== 'undefined' && libro[i].imgdata != null) {
                //console.log(libro[i].imgdata)
                let tempbin = libro[i].imgdata;
                let data64 = Buffer.from(tempbin, 'binary').toString('base64');
                libro[i].imgdata = data64;
                //console.log(libro[i].imgdata);
            }
        }

        res.render('autor/listLibros', { title: libro[0].autor, libros: libro, autor: libro[0].autor })
        //res.render('autor/listView', { libros: rows })
    });
}


exports.formCrear = (req, res) => {
    res.render('autor/create', { title: 'Registra un autor' });
}
var dateFormat = require('dateformat');

exports.create = (req, res) => {
    let newAutor = new Autor(req.body.nombre, req.body.fnac);

    Autor.create(newAutor, (err, insertedID) => {
        if (err)
            res.send("ERROR", err)
        else 
            res.render('autor/create', {title: 'Registra un autor', alerta: 'Autor creado con el id: ' + insertedID })
    })
}
