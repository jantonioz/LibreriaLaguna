'use strict';

const sql = require('./db.js');
const ItemCompra = require('./item_compra');


const INSERT =
    'INSERT INTO compras (comp_verif, comp_fpago, comp_mpago, comp_estado, usr_id, ses_id, created_at, updated_at) ' +
    ' VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())';

const UPDATE =
    'UPDATE compras SET comp_verif = ?, comp_fpago = ?, comp_mpago = ?, comp_estado = ?, ' +
    'updated_at = NOW() WHERE comp_id = ?';

const GETLASTBYUSER =
    'SELECT * FROM compras WHERE usr_id = ? ORDER BY updated_at DESC limit 1';

const GETALLBYUSER =
    'SELECT * FROM compras WHERE usr_id = ? ORDER BY updated_at DESC';

const GETTRANSPORTES = 
    'SELECT * FROM transporte';


// const GET_ALL_BY_USER_COMPLETE = 
//     'SELECT com.comp_verif AS verif, com.comp_fpago AS forma, com.comp_mpago AS metodo, ' +
//     'com.com_estado AS estado, trans.trans_nombre AS transporte, item.item_cantidad AS cantidad, item.item_preciou AS precio, ' +
//     'lib.titulo AS titulo, tipoe.tipo_descripcion AS tipo_desc ' +
//     'FROM compras AS com ' +
//     'LEFT JOIN transporte AS trans ON (com.trans_id = trans.trans_id) ' +
//     'LEFT JOIN item_compra AS item ON (item.compras_id = com.comp_id) ' +
//     'LEFT JOIN ejemplares AS ejem ON (ejem.ejem_id = item.ejemplares_id) ' +
//     'LEFT JOIN libros AS lib ON (ejem.libro_id = lib.lib_id) '+
//     'LEFT JOIN tipoejemplares AS tipoe ON (ejem.tipo_id = tipoe.tipo_id) ' +
//     'WHERE com.usr_id = ?';

const GET_ALL_BY_USER_COMPLETE =
    'SELECT com.comp_id AS comp_id, com.comp_verif AS verif,'+
    ' com.created_at AS fecha,' +
    ' com.comp_fpago AS forma, com.comp_mpago AS metodo, ' +
    'com.com_estado AS estado, trans.trans_nombre AS transporte ' +
    'FROM compras AS com ' +
    'LEFT JOIN transporte AS trans ON (com.trans_id = trans.trans_id) ' +
    'WHERE com.usr_id = ?';

const GET_ALL_ITEMS = 
    'SELECT item.item_id AS item_id, item.item_cantidad AS cantidad, item.item_preciou AS precio, ' +
    'lib.titulo AS titulo, tipoe.tipo_descripcion AS descripcion, ejem.ejem_id AS ejem_id ' +
    'FROM item_compra as item ' +
    'INNER JOIN ejemplares AS ejem ON (item.ejemplares_id = ejem.ejem_id) ' +
    'INNER JOIN libros AS lib ON (ejem.libro_id = lib.lib_id) ' +
    'INNER JOIN tipoejemplares AS tipoe ON (ejem.tipo_id = tipoe.tipo_id) ' +
    'WHERE item.compras_id = ?';

const FINALIZAR_COMPRA = 'CALL proc_finalizar_compra(?, ?)';

const UPDATE_COMPRA = 'UPDATE compras SET comp_fpago = ?, comp_mpago = ?, trans_id = ? ' +
    'WHERE comp_id = ?';


class Compra {
    constructor({ id = 0, verif = 0, forma = 'Debito', metodo = 'PayPal', estado = 'Shopping', usr_id = null, ses_id = null }) {
        this.id = id;
        this.verif = verif;
        this.forma = forma;
        this.metodo = metodo;
        this.estado = estado;
        this.usr_id = usr_id;
        this.ses_id = ses_id;
    }

    getParams() {
        let list = [this.verif, this.forma, this.metodo, this.estado, this.usr_id, this.ses_id];
        return list;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, getParams(), (err, res) => {
                if (!err) {
                    this.id = res.insertId;
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [this.verif, this.forma, this.metodo, this.estado, this.id],
                (err, res) => {
                    if (!err) {
                        resolve(res);
                    } else {
                        resolve(-1);
                    }
                });
        });
    }

    async getItems() {
        list = await ItemCompra.getByCompra(this.id);
        return list;
    }
}

Compra.update = (fpago, mpago, trans_id, comp_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UPDATE_COMPRA, [fpago, mpago, trans_id, comp_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Compra.getTransportes = () => {
    return new Promise((resolve, reject) => {
        sql.query(GETTRANSPORTES, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Compra.lastByUser = (user_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GETLASTBYUSER, [user_id], (err, res) => {
            if (!err) {
                resolve(res[0]);
            } else {
                reject(err);
            }
        })
    })
}

Compra.finalizar = (usr_id, ses_id) => {
    return new Promise((resolve, reject) => {
        sql.query(FINALIZAR_COMPRA, [usr_id, ses_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Compra.getAllByUser = (user_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GETALLBYUSER, [user_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(-1);
            }
        });
    });
}

Compra.getAllByUserComplete = (usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GET_ALL_BY_USER_COMPLETE, usr_id, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Compra.getItems = (comp_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GET_ALL_ITEMS, comp_id, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = Compra;