const sql = require('./db');

const GETALL = 'SELECT * FROM tipoejemplares;';

const INSERT = 'INSERT INTO tipoejemplares(tipo_descripcion, tipo_dimensiones, ses_id, created_id, updated_id) ' +
    'VALUES (?, ?, ?, NOW(), NOW())';

const UPDATE = 'UPDATE tipoejemplares SET tipo_descripcion = ?, tipo_dimensiones = ?, ses_id = ?, updated_at = NOW();'

class TipoEjemplar {
    constructor(descripcion, dimensiones, ses_id = 1, id = 0) {
        this.descripcion = descripcion;
        this.dimensiones = dimensiones;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.descripcion, this.dimensiones, this.ses_id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            })
        });
    }

    update(ses_id) {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [this.descripcion, this.dimensiones, ses_id],
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

TipoEjemplar.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(GETALL, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(null);
                reject(err);
            }
        });
    });
}

module.exports = TipoEjemplar;