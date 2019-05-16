'use strict';

var sql = require('./db.js');
var Libro = require('./libro');

const insert = 'INSERT INTO Autores(aut_nombre, aut_fecnac, aut_biografia, ses_id, created_at, updated_at) VALUES(?, ?, ?, ?, NOW(), NOW())';
const SELECT_ALL = "SELECT * FROM Autores";
const findByName = " WHERE aut_nombre like ?";
const findByID = ' WHERE aut_id = ?';

const fullINFO = 'SELECT lib.lib_id, lib.titulo, lib.isbn,lib.paginas, lib.descripcion_fisica, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, img.data AS imgdata,' +
    ' img.img_filename AS filename,  ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id ' +
    ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' INNER JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN imagen_libro AS img ON (lib.lib_id = img.libro_id) ';

const libroBy = fullINFO + ' WHERE aut.aut_id =  ?';

class Autor {
    constructor(nombre, fecnac, biografia, ses_id, aut_id = 0) {
        this.nombre = nombre;
        this.fecnac = fecnac;
        this.biografia = biografia;
        this.ses_id = ses_id;
        this.aut_id = aut_id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(insert, [this.nombre, this.fecnac, this.biografia, this.ses_id], (err, res) => {
                if (!err) {
                    resolve(res.insertId);
                } else {
                    reject(err);
                }
            });
        });
    }
}

// Autor.create = (newAuthor, result) => {
//     sql.query(insert, [newAuthor.nombre, newAuthor.fnac], function (err, res) {
//         if (err) {
//             console.log("Error :", err)
//             result(err, null)
//         }
//         else {

//             // console.log(res.insertId);
//             // result(null, res.insertId);
//         }
//     })
// }

Autor.booksBy = (autor_id, result) => {
    //console.log(libroBy, autor_id);
    sql.query(libroBy, autor_id, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
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

Autor.findByNombre = (nombre, result) => {
    sql.query(SELECT_ALL + findByName, nombre, function (err, res) {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

Autor.find = (result) => {
    sql.query(SELECT_ALL, function (err, res) {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
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