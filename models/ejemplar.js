'use strict';

const sql = require('./db');

const INSERT =
    'INSERT INTO ejemplares(ejem_cantidad, ejem_precio, sku, libro_id, lote_id, ses_id, created_at, updated_at)' +
    ' VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())';


class Ejemplar {
    constructor(cantidad, precio, sku, libro_id, lote_id, ses_id, id = 0) {
        this.cantidad = cantidad;
        this.precio = precio;
        this.sku = sku;
        this.libro_id = libro_id;
        this.lote_id = lote_id;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT,
                [this.cantidad, this.precio, this.sku, this.libro_id, this.lote_id, this.ses_id],
                (err, res) => {
                    if (!err) {
                        resolve(res);
                    } else {
                        resolve(null);
                    }
                });
        });
    }
}

module.exports = Ejemplar;