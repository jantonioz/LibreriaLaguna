'use strict';

const sql = require('./db');

const INSERT =
    'INSERT INTO ejemplares(ejem_cantidad, ejem_precio, sku, libro_id, lote_id, tipo_id, ses_id, created_at, updated_at)' +
    ' VALUES(?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

const SELECTBYLIBRO =
    'SELECT lib.titulo AS titulo, lib.descripcion AS descripcion, lib.fecha_pub AS publicacion, ' +
    'ejem.ejem_cantidad AS cantidad, ejem.ejem_precio AS precio, ejem.ejem_id AS ejem_id, ' +
    '(SELECT prov.prov_nombre FROM proveedores AS prov where prov.prov_id = (SELECT lot.proveedor_id FROM lotes AS lot where lot.lot_id = ejem.lote_id)) AS proveedor ' +
    'FROM ejemplares AS ejem ' +
    'INNER JOIN libros AS lib ON (lib.lib_id = ejem.libro_id) ' +
    'WHERE ejem.libro_id = ?';

const SELECTALL_WLIBRO =
    'SELECT lib.titulo AS titulo, lib.descripcion AS descripcion, lib.fecha_pub AS publicacion, ' +
    'ejem.ejem_cantidad AS cantidad, ejem.ejem_precio AS precio, ejem.ejem_id AS ejem_id, tipoe.tipo_descripcion AS tipo_desc,' +
    '(SELECT prov.prov_nombre FROM proveedores AS prov where prov.prov_id = (SELECT lot.proveedor_id FROM lotes AS lot where lot.lot_id = ejem.lote_id)) AS proveedor ' +
    'FROM ejemplares AS ejem ' +
    'INNER JOIN tipoejemplares AS tipoe ON (ejem.tipo_id = tipoe.tipo_id) ' +
    'INNER JOIN libros AS lib ON (lib.lib_id = ejem.libro_id) ';

const SELECT_BY_ID = 'SELECT * FROM ejemplares WHERE ejem_id = ?';

const SELECT_BY_LOTE = 'SELECT ejem.ejem_id AS ejem_id, ejem.ejem_cantidad AS ejem_cantidad, ejem.ejem_precio AS ejem_precio, ' +
    'ejem.sku AS sku, ejem.libro_id AS libro_id, ejem.lote_id AS lote_id, tipo.tipo_descripcion AS tipo, ' +
    'lib.titulo AS libro ' +
    'FROM ejemplares as ejem ' +
    'INNER JOIN libros as lib ON (lib.lib_id = ejem.libro_id) ' +
    'INNER JOIN tipoejemplares AS tipo ON (ejem.tipo_id = tipo.tipo_id) ' +
    'WHERE ejem.lote_id = ?';


class Ejemplar {
    constructor(cantidad, precio, sku, libro_id, lote_id, ses_id, tipo_id, id = 0) {
        this.cantidad = cantidad;
        this.precio = precio;
        this.sku = sku;
        this.libro_id = libro_id;
        this.lote_id = lote_id;
        this.ses_id = ses_id;
        this.id = id;
        this.tipo_id = tipo_id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT,
                [this.cantidad, this.precio, this.sku, this.libro_id, this.lote_id, this.tipo_id, this.ses_id],
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

Ejemplar.getByLote = (lote_id) => {
    return new Promise((resolve, reject) => {
        sql.query(SELECT_BY_LOTE, lote_id, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Ejemplar.getById = (ejem_id) => {
    return new Promise((resolve, reject) => {
        sql.query(SELECT_BY_ID, ejem_id, (err, res) => {
            if (!err) {
                console.log("EJEM GETBYID: ", res);
                resolve(res[0]);
            } else {
                reject(err);
            }
        });
    });
}

Ejemplar.getAllByLibro = (libroId) => {
    return new Promise((resolve, reject) => {
        sql.query(SELECTBYLIBRO, libroId, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Ejemplar.getAllWithLibro = () => {
    return new Promise((resolve, reject) => {
        sql.query(SELECTALL_WLIBRO, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        }); 
    });
}

module.exports = Ejemplar;