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


module.exports = Editorial;