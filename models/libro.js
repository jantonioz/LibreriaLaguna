'use strict';

var sql = require('./db.js')

const selectors = 'lib.ID AS lib_id, lib.titulo, lib.isbn,lib.paginas, lib.descripcion_fisica, ' +
'lib.descripcion, gen.gen_nombre AS genero,  aut.nombre AS autor, img.data AS imgdata, img.img_filename AS filename,  ' + 
'aut.ID as autor_id, gen.ID as gen_id ';

const genero = ' FROM libros AS lib INNER JOIN generos AS gen ON (lib.genero_id = gen.ID) ' +
    ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.ID) ' +
    ' INNER JOIN autores AS aut ON (aut.ID = al.autor_id) ';

const imageJOIN = ' LEFT JOIN imagen_libro AS img ON (lib.ID = img.libro_id) '


const insert = "INSERT INTO libros(titulo, orig_titulo, isbn, paginas, descripcion_fisica, descripcion, editorial_id, genero_id)" +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

// Constructor de Libro
// var Libro = (libro) => {
//     this.ID = libro.ID
//     this.titulo = libro.titulo
//     this.tituloOrig = libro.tituloOrig
//     this.isbn = libro.isbn
//     this.paginas = libro.paginas
//     this.descripcion = libro.descripcion
//     this.descripcion_fisica = libro.descripcion_fisica
//     this.editorial_id = libro.editorial_id
//     this.genero_id = libro.genero_id
// }

class Libro {
    constructor(titulo, tituloO, isbn, paginas, descripcion, descripcion_fisica, gen_id, ed_id) {
        this.titulo = titulo
        this.tituloOrig = tituloO
        this.isbn = isbn
        this.paginas = paginas
        this.descripcion = descripcion
        this.descripcion_fisica = descripcion_fisica
        this.editorial_id = ed_id
        this.genero_id = gen_id
    }
}


Libro.createLibro = function createUser(newLibro, result) {

    sql.query(insert,
        [newLibro.titulo, newLibro.tituloOrig, newLibro.isbn, newLibro.paginas,
        newLibro.descripcion_fisica, newLibro.descripcion, newLibro.editorial_id,
        newLibro.genero_id],
        (err, res) => {
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
    sql.query("SELECT " + selectors + genero + imageJOIN + " WHERE lib.id = ? ", libroId, function (err, res) {
        if (err) {
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Libro.getAllLibros = function getAllLibros(result) {
    sql.query("SELECT * FROM libros " +
        "AS lib INNER JOIN generos AS gen ON (lib.genero_id = gen.id) ", function (err, res) {
            if (err) {
                console.log("error: ", err)
                result(null, err)
            } else {
                console.log(res)
                result(null, res)
            }
        })
}

Libro.find = function findLibro(titulo, result) {
    sql.query("SELECT * " + genero + " WHERE titulo LIKE ?", '%' + titulo + '%', function (err, res) {
        if (err) {
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

Libro.remove = function (id, result) {
    sql.query("DELETE FROM libros WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

module.exports = Libro;