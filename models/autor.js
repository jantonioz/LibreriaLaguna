'use strict';

var sql = require('./db.js');
var Libro = require('./libro');
const imagenLibro = require('./imagen_libro');

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

const normalInfoHeaders =
    'lib.lib_id, lib.titulo, lib.orig_titulo, lib.isbn,lib.paginas, lib.fecha_pub, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id, lib.editorial_id, ed.ed_nombre AS editorial ';

const completeInfo = ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' LEFT JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' LEFT JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN editoriales AS ed ON (ed.ed_id = lib.editorial_id) ';

const WHEREAUT_ID = 'WHERE aut.aut_id = ?';

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

Autor.booksBy = (autor_id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT " + normalInfoHeaders + completeInfo + WHEREAUT_ID, autor_id, async (err, res) => {
            if (!err) {
                for (var i = 0; i < res.length; i++) {
                    let imagenes = await imagenLibro.getImagesOfLibroID(res[i].lib_id);
                    console.log(imagenes);
                    if (imagenes.length > 0) {
                        res[i].imagenes = imagenes;
                        res[i].imagenes[0].active = 1;
                    }
                }
                resolve(res);
            } else {
                console.log(err);
            }
        })
    });
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

Autor.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(SELECT_ALL + findByID, id, (err, res) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
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