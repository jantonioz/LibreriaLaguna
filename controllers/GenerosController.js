'use strict';

var Genero = require('../models/genero');


exports.list_all_generos = (req, res) => {
    Genero.find((err, rows) => {
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('genero/listView', {title: 'Generos', generos: rows })
    })
}

exports.getLibrosBy = (req, res) => {
    Genero.booksBy(req.params.gen_id, (err, rows) => {
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('genero/listLibros', {title: rows[0].genero, libros: rows, genero: rows[0].genero })
    })
}