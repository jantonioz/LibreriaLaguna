'use strict';

var sql = require('./db.js');

const INSERT =
    'INSERT INTO imagen_libro(img_path, img_filename, libro_id, ses_id, created_at, updated_at)' +
    ' VALUES (?, ?, ?, ?, NOW(), NOW())';

const UPDATEDATA =
    'UPDATE imagen_libro SET data = ?, updated_at = NOW() WHERE img_id = ?';

const UPDATE =
    'UPDATE imagen_libro SET img_path = ?, img_filename = ?, libro_id = ?, updated_at = NOW() WHERE img_id = ?';

class ImagenLibro {
    constructor(libro_id, path, img_filename, ses_id, id = 0) {
        this.libro_id = libro_id;
        this.path = path;
        this.img_filename = img_filename;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.path, this.img_filename, this.libro_id, this.ses_id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(-1);
                }
            });
        });
    }

    /*updateData() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATEDATA, [this.data, this.id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }*/

    update() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [this.path, this.img_filename, this.libro_id, this.id], (err, res) => {
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
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM imagen_libro WHERE libro_id = ?", libro_id, (err, res) => {
            if (err) {
                resolve('undefined');
            }
            resolve(res);
        })
    });

}


module.exports = ImagenLibro