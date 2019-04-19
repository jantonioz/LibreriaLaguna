'use strict';

var sql = require('./db.js')
const genero = ' FROM libros AS lib INNER JOIN generos AS gen ON (lib.genero_id = gen.ID) ' + 
                ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.ID) ' +
                ' INNER JOIN autores AS aut ON (aut.ID = al.autor_id) ';

// Constructor de Libro
var Libro = function (libro) {
    this.ID = libro.ID
    this.Titulo = libro.Titulo
    this.TituloOriginal = libro.TituloOriginal
    this.ISBN = libro.ISBN
    this.Autor = libro.Autor
    this.Nummero_pag = libro.Nummero_pag
    this.Dimension = libro.Dimension
    this.Descripcion = libro.Descripcion
    this.gen_nombre = libro.gen_nombre
    this.imagen = libro.imagen
}

Libro.createLibro = function createUser(newLibro, result) {
    
    sql.query("INSERT INTO libros set ?", newLibro, function (err, res) {
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
    sql.query("SELECT * " + genero +" WHERE lib.id = ? ", libroId, function (err, res) {
        if (err) {
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Libro.getAllLibros = function getAllLibros(result) {
    sql.query("SELECT * FROM libros "  + 
    "AS lib INNER JOIN generos AS gen ON (lib.genero_id = gen.id) ", function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

Libro.find = function findLibro(titulo, result){
    sql.query("SELECT * " + genero + " WHERE titulo LIKE ?", '%'+titulo+'%', function(err, res){
        if (err){
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

Libro.updateTitleById = function update(id, libro, result) {
    sql.query("UPDATE libros SET Titulo = ? WHERE id = ?", [libro.Titulo, id],
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
    sql.query("DELETE FROM libros WHERE id = ?", [id], function(err, res){
        if (err) {
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

module.exports = Libro;