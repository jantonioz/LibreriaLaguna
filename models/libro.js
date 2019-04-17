'use strict';

var sql = require('./db.js')

// Constructor de Libro
var Libro = function (libro) {
    this.ID = libro.ID,
        this.Titulo = libro.Titulo,
        this.TituloOriginal = libro.TituloOriginal,
        this.ISBN = libro.ISBN,
        this.Autor = libro.Autor,
        this.Nummero_pag = libro.Nummero_pag,
        this.Dimension = libro.Dimension,
        this.Descripcion = libro.Descripcion
}

Libro.createLibro = function createUser(newLibro, result) {
    
    sql.query("INSERT INTO libro set ?", newLibro, function (err, res) {
        if (err) {
            console.log("error :", err)
            result(err, null)
        } else {
            console.log(res.insertId)
            result(null, res.insertId)
        }
    })
}

Libro.getLibroById = function createUser(libroId, result) {
    // '?' es un placeholder como %s o %d
    sql.query("SELECT * FROM libro WHERE ID = ?", libroId, function (err, res) {
        if (err) {
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Libro.getAllLibros = function getAllLibros(result) {
    sql.query("SELECT * FROM libro", function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

Libro.updateTitleById = function update(id, libro, result) {
    sql.query("UPDATE libro SET Titulo = ? WHERE id = ?", [libro.Titulo, id],
        function (err, res) {
            if (err) {
                console.log("error: ", err)
                result(null, err)
            } else {
                result(null, res)
            }
        })
}

Libro.remove = function (id, result){
    sql.query("DELETE FROM libro WHERE id = ?", [id], function(err, res){
        if (err) {
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

module.exports = Libro;