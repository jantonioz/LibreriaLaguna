'use strict';

var sql = require('./db.js')

const INSERT = 'INSERT INTO autor_libro(autor_id, libro_id) VALUES(?, ?)';

// Constructor de A U T O R - L I B R O
class AutorLibro {
    constructor(autor_id, libro_id) {
        this.autor_id = autor_id;
        this.libro_id = libro_id;
    }


    save(result) {
        sql.query(INSERT, [this.autor_id, this.libro_id], (err, res) => {
            if(err){
                console.log("ERROR:", err);
                result(err, null);
            }else{
                result(null, res);
            }
        })
    }

}

module.exports = AutorLibro;