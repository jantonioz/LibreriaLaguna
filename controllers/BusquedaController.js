'use strict';

var Libro = require('../models/libro');
var Editorial = require('../models/editorial');
var Genero = require('../models/genero');
var Autor = require('../models/autor');

exports.find = async (req, res) => {
    var search = req.body.search;
    let libros = await getLibros  ('%'+search+'%');
    let generos = await getGeneros('%'+search+'%');
    let autores = await getAutores('%'+search+'%');

    res.render('busqueda/listView', {title: 'Busqueda', libros: libros, generos: generos, autores: autores, editoriales: []});
}

function getEditoriales(search) {
    return new Promise((resolve, reject) => {

    });
}

function getAutores(search) {
    return new Promise((resolve, reject) => {
        Autor.findByNombre(search, (err, res) => {
            if (!err) {
                resolve(res);
            }
        });
    });
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
                for (let i = 0; i < res.length; i++) {
                    if (typeof res[i].imgdata !== 'undefined' && res[i].imgdata != null) {
                        let tempbin = res[i].imgdata;
                        let data64 = Buffer.from(tempbin, 'binary').toString('base64');
                        res[i].imgdata = data64;
                    }
                }
                resolve(res);
            }
        });
    });
}