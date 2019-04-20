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

module.exports = Genero