'use strict';

var Libro = require('../models/libro');
var Editorial = require('../models/editorial');
var Genero = require('../models/genero');
var Autor = require('../models/autor');

exports.find = async (req, res) => {
    var search = req.body.search;
    let libros = await getLibros(search);
    let generos = await getGeneros(search);
    res.json({libros, generos})
}

function getGeneros(search) {
    return new Promise((resolve, reject) => {
        Genero.findByNombre(search, (err, res) => {
            if (!err) {
                resolve(res);
            }
        });
    });
}

function getLibros(search) {
    return new Promise((resolve, reject) => {
        Libro.find(search, (err, res) => {
            if (!err) {
                resolve(res);
            }
        });
    });
}