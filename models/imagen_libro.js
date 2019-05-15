'use strict';

var sql = require('./db.js');

const INSERT =
    'INSERT INTO imagen_libro(data, img_filename, libro_id, ses_id, created_at, updated_at)' +
    ' VALUES (?, ?, ?, ?, NOW(), NOW())';

const UPDATEDATA = 
    'UPDATE imagen_libro SET data = ?, updated_at = NOW() WHERE img_id = ?';

const UPDATE = 
    'UPDATE imagen_libro SET data = ?, img_filename = ?, libro_id = ?, updated_at = NOW() WHERE img_id = ?';

class ImagenLibro {
    constructor(libro_id, data, img_filename, ses_id, id = 0) {
        this.libro_id = libro_id;
        this.data = data;
        this.img_filename = img_filename;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.data, this.img_filename, this.libro_id, this.ses_id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    updateData() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATEDATA, [this.data, this.id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [this.data, this.img_filename, this.libro_id, this.id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }
}


ImagenLibro.getImagesOfLibroID = (libro_id, result) => {
    sql.query("SELECT * FROM imagen_libro WHERE libro_id = ?", libro_id, (err, res) => {
        if (err) {
            console.log("error:", err)
            result(err, null)
        }
        result(null, res)
    })
}


module.exports = ImagenLibro