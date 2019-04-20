'use strict';

var Autor = require('../models/autor')

exports.list_all_authors = function (req, res) {
    Autor.find(null, function (err, rows) {
        console.log("Autores Controller")
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('autor/listView', { autores: rows })
    })
}

 
exports.listBooksOf = (req, res) => {
    let aut_id = req.params.aut_id;
    Autor.booksBy(aut_id, (err, rows) => {
        console.log("Autores Controller")
        if (err) {
            //res.send(err)
        }
        console.log('res', rows)
        //res.send("OK")
        res.render('autor/listLibros', {libros: rows, autor: rows[0].autor})
        //res.render('autor/listView', { libros: rows })
    })

}

