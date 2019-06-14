'use strict';

const sql = require('./db');

const INSERT =
    'INSERT INTO item_compra (item_cantidad, item_preciou, ejemplares_id, compras_id, ses_id,' +
    ' created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';

const REMOVE = 
    'DELETE FROM item_compra WHERE item_id = ?';

const BYCOMPRA = 
    'SELECT * FROM item_compra WHERE compras_id = ?';

const UPDATE = 'UPDATE item_compra SET item_cantidad = ?, ejemplares_id = ?, item_preciou = ? ' +
    'WHERE item_id = ?';

class ItemCompra {
    constructor(cantidad, precio, ejemplar_id, compra_id, ses_id, id = 0) {
        this.cantidad = cantidad;
        this.precio = precio;
        this.ejemplar_id = ejemplar_id;
        this.compra_id = compra_id;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.cantidad, this.precio, this.ejemplar_id, this.compra_id, this.ses_id],
                (err, res) => {
                    if (!err) {
                        this.id = res.insertId;
                        resolve(res); // insertId...
                    } else {
                        resolve(null);
                    }
                });
        });
    }
}


ItemCompra.update = (item_id, cantidad, precio, ejemplar_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UPDATE, [cantidad, ejemplar_id, precio, item_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        })
    });
}

ItemCompra.remove = (item_id) => {
    return new Promise((resolve, reject) => {
        sql.query(REMOVE, [item_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

ItemCompra.getByCompra = (compra_id) => {
    return new Promise((resolve, reject) => {
        sql.query(BYCOMPRA, [compra_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = ItemCompra;