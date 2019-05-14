'use strict';

var sql = require('./db.js')

const INSERT = 'INSERT INTO autor_libro(autor_id, libro_id, ses_id) VALUES(?, ?, ?)';
const UPDATE = 'UPDATE autor_libro SET autor_id = ?, libro_id = ? WHERE ' +
    'autor_id = ? AND libro_id = ?';


class AutorLibro {
    constructor(autor_id, libro_id, ses_id) {
        this.autor_id = autor_id;
        this.libro_id = libro_id;
        this.ses_id = ses_id;
    }


    save() {
        return new Promise((resolve, rejec) => {
            sql.query(INSERT, [this.autor_id, this.libro_id, this.ses_id], (err, res) => {
                if (err) {
                    console.log("ERROR:", err);
                    resolve(-1);
                } else {
                    resolve(res.insertId);
                }
            })
        });
    }

    update(newLibroID, newAutorID) {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [newAutorID, newLibroID, this.autor_id, this.libro_id],
                (err, res) => {
                    if (!err) {
                        resolve(res);
                    } else {
                        reject(err);
                    }
                });
        });

    }
}

module.exports = AutorLibro;