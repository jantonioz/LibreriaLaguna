'use strict';

var sql = require('./db');

const table = 'proveedores';

const fields = { id: 'prov_id', nombre: 'prov_nombre', email: 'prov_email', direccion: 'direccion_id' };

const COMMA = ', ';

const INSERT = 'INSERT INTO ' + table + '('
    + fields.nombre + COMMA + fields.email + COMMA + fields.direccion + COMMA +
    'created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';

const ASSIGN = ' = ? ';

const UPDATE = 'UPDATE ' + table + ' SET ' +
    fields.nombre + ASSIGN + COMMA +
    fields.email + ASSIGN + ' WHERE ' + fields.id + ASSIGN;

//  DELETE FROM proveedores WHERE prov_id = ?
const DELETE = 'DELETE FROM ' + table + ' WHERE ' + fields.id + ASSIGN;

const QUERY_ID = 'SELECT ' + fields.id + ' FROM ' + table +
    ' WHERE ' + fields.email + ASSIGN;

const QUERY_LOTES = 'SELECT * FROM lotes WHERE proveedor_id = ?';

const QUERY_SELECTALL = 'SELECT * FROM proveedores';

class Proveedor {
    constructor(nombre, email, direccion_id, id = 0) {
        this.nombre = nombre;
        this.email = email;
        this.direccion_id = direccion_id;
        this.id = id;
    }

    save(callback) {
        sql.query(INSERT, [this.nombre, this.email, this.direccion_id], (err, res) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }

    update(callback) {
        sql.query(UPDATE, [this.nombre, this.email], (err, res) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }

    delete(callback) {
        sql.query(DELETE, [this.id], (err, res) => {

        });
    }

    getId(callback) {
        sql.query(QUERY_ID, [this.email], (err, res) => {
            if (err) {
                callback(err, null);
            } else {
                this.id = res[0].prov_id;
                callback(null, res);
            }
        });
    }

    getLotes(callback) {
        if (!id || id == 0) {
            callback(null, null);
            return;
        }
        sql.query(QUERY_LOTES, [this.id], (err, res) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }

    all() {
        return new Promise((resolve, reject) => {
            sql.query('SELECT * FROM proveedores', (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

    }
}

module.exports = Proveedor