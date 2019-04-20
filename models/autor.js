'use strict';

var sql = require('./db.js')

// Constructor de A U T O R E S
class Autor {
    constructor(nombre, fnac) {
        this.nombre = aut_nombre;
        this.fnac = fnac;
    }
}

const insert        = 'INSERT INTO Autores(aut_nombre, aut_fecnac) VALUES(?,?)';
const SELECT_ALL    = "SELECT * FROM Autores";
const findByName    = " WHERE aut_name like ?";
const findByID      = ' WHERE aut_id = ?';

Autor.create = (newAuthor, result) => {

    sql.query(insert, [newAuthor.nombre, newAuthor.fnac], function (err, res) {
        if (err) {
            console.log("Error :", err)
            result(err, null)
        }
        else {
            console.log(res.insertID)
            result(null, res.insertID)
        }
    })
}

Autor.getBookByAuthor = function getBook(authorNombre, result) {

    sql.query("SELECT * FROM Autores WHERE Nombre = ?", authorNombre, function (err, res) {
        if (err) {
            console.log("Error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Autor.find = (name, result) => {
    let mQuery = name == null ? SELECT_ALL : SELECT_ALL + findByName;
    sql.query(mQuery, null, function (err, res) {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            //console.log("OK: ", res);
            result(null, res);
        }
    });
}

Autor.findById = (id, result) => {
    sql.query(SELECT_ALL + findByID, id, (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            result(null, res.insertID);
        }
    });
}

Autor.remove = function (ID, result) {

    sql.query("DELETE FROM Autores where aut_id = ", [ID], function (err, res) {
        if (err) {
            console.log("Error: ", err)
            result(null, res)
        } else {
            result(null, res)
        }
    })
}

module.exports = Autor;