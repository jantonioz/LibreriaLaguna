'use strict';
var sql = require('./db.js');

class Editorial{
    constructor(ed_nombre){
        this.nombre = ed_nombre;
    }
}

const INSERT     = 'INSERT INTO Editoriales(ed_nombre) VALUES(?) ';
const SELECT_ALL = 'SELECT * FROM Editoriales ';
const findByName = 'WHERE ed_nombre like ?';
const findById   = 'WHERE ed_id = ?';

const fullINFO = 'SELECT lib.lib_id, lib.titulo, lib.isbn,lib.paginas, lib.descripcion_fisica, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, img.data AS imgdata,' +
    ' img.img_filename AS filename,  ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id, ' +
    'ed.ed_nombre as ed_nombre'+
    ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' INNER JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN imagen_libro AS img ON (lib.lib_id = img.libro_id) ' +
    ' LEFT JOIN editoriales AS ed ON (ed.ed_id = lib.editorial_id)';

const libroBy = fullINFO + ' WHERE ed.ed_id = ?';

Editorial.create = (nEditorial, result) => {
    sql.query(INSERT, nEditorial.ed_nombre, (err, res)=>{
        if (err) {
            console.log("ERROR:", err)
            result(res, null)
        } else{
            result(null, res)
        }
    });
}

Editorial.find = (name, result) => {
    let query = name == null ? SELECT_ALL : SELECT_ALL + findByName;
    sql.query(query, name, (err, res) => {
        if (err){
            console.log("ERROR: ", res);
            result(err, null);
        } else{
            //console.log("OK:", res);
            result(null, res);
        }
    });
}

Editorial.findById = (id, result) => {
    console.log(id);
    sql.query(SELECT_ALL + findById, id, (err, res) => {
        if (err){
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            //console.log("OK: ", res);
            result(null, res);
        }
    });
}

Editorial.booksBy = (ed_id, result) => {
    sql.query(libroBy, ed_id, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

module.exports = Editorial;