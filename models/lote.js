'use strict';

const sql = require('./db');

const INSERT =
    'INSERT INTO lotes(lote_descripcion, fentrega, proveedor_id, ses_id, created_at, updated_at)' +
    ' VALUES(?, ?, ?, ?, NOW(), NOW())';
const SELECT = 
    'SELECT  *' +
    'FROM lotes ';

const LISTALL = 
    'SELECT lot.lot_id AS lot_id, lot.lote_descripcion AS lote_descripcion, ' + 
    'lot.fentrega AS fentrega, lot.proveedor_id AS proveedor_id, ' +
    'prov.prov_nombre AS proveedor ' +
    'FROM lotes AS lot ' + 
    'INNER JOIN proveedores AS prov ON (lot.proveedor_id = prov.prov_id)';

const GETBYPROV = 
    'SELECT *' +
    'FROM lotes AS lot ' +
    'WHERE proveedor_id = ?';
    

class Lote {
    constructor(descripcion, fentrega, proveedor_id, ses_id, id = 0) {
        this.descripcion = descripcion;
        this.fentrega = fentrega;
        this.proveedor_id = proveedor_id;
        this.ses_id = ses_id;
        this.id = 0;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT,
                [this.descripcion, this.fentrega, this.proveedor_id, this.ses_id],
                (err, res) => {
                    if (!err) {
                        resolve(res.insertId);
                    } else {
                        reject(err);
                    }
                });
        });
    }
}

Lote.get = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(SELECT + ' WHERE lot_id = ?', id, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(null);
            }
        });
    });
}

Lote.listAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(LISTALL, (err, res) =>{
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Lote.getByProv = (proveedor_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GETBYPROV, proveedor_id,(err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = Lote;