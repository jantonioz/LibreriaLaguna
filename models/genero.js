'use strict';

var sql = require('./db');

class Genero {
    constructor(nombre) {
        this.nombre = nombre;
    }
}

const INSERT = 'INSERT INTO Generos(gen_nombre) VALUES(?)';
const SELECT_ALL = 'SELECT * FROM Generos ';
const filterByName = 'WHERE gen_nombre like ?';
const filterById = 'WHERE gen_id = ?';

const fullINFO = 'SELECT lib.lib_id, lib.titulo, lib.isbn,lib.paginas, lib.descripcion_fisica, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, img.data AS imgdata,' +
    ' img.img_filename AS filename,  ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id ' +
    ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' INNER JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN imagen_libro AS img ON (lib.lib_id = img.libro_id) ';

const libroBy = fullINFO + ' WHERE gen.gen_id =  ?';


Genero.create = (newGenero, result) => {
    sql.query(INSERT, newGenero.nombre, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

Genero.find = (result) => {
    sql.query(SELECT_ALL, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

Genero.findByNombre = (nombre, result) => {
    sql.query(SELECT_ALL + filterByName, nombre, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

Genero.findById = (id, result) => {
    sql.query('SELECT gen_nombre AS genero FROM generos WHERE gen_id = ?', id, (err, res) => {
        if (err){
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

Genero.booksBy = (gen_id, result) => {
    sql.query(libroBy, gen_id, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

module.exports = Genero