'use strict';

const sql = require('./db');

const INSERT =
    'INSERT INTO lotes(lot_descripcion, lot_fentrega, proveedor_id, ses_id, created_at, updated_at)' +
    ' VALUES(?, ?, ?, ?, NOW(), NOW())';

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
                        resolve(res);
                    } else {
                        resolve(null);
                    }
                });
        });
    }
}