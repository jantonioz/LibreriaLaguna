'use strict';

const sql = require('./db');

const INSERT =
    'INSERT INTO ejemplares(ejem_cantidad, ejem_precio, sku, libro_id, lote_id, ses_id, created_at, updated_at)' +
    ' VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())';

const SELECTBYLIBRO = 
    'SELECT lib.titulo AS titulo, lib.descripcion AS descripcion, lib.fecha_pub AS publicacion, ' +
    'ejem.ejem_cantidad AS cantidad, ejem.ejem_precio AS precio, ' +
    '(SELECT prov.prov_nombre FROM proveedores AS prov where prov.prov_id = (SELECT lot.proveedor_id FROM lotes AS lot where lot.lot_id = ejem.lote_id)) AS proveedor '+
    'FROM ejemplares AS ejem ' +
    'INNER JOIN libros AS lib ON (lib.lib_id = ejem.libro_id) ' +
    'WHERE ejem.libro_id = ?';


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

Ejemplar.getAllByLibro = (libroId) => {
    console.log(SELECTBYLIBRO);
    return new Promise((resolve, reject) => {
        sql.query(SELECTBYLIBRO, libroId, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = Ejemplar;