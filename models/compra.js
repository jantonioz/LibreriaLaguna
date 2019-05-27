'use strict';

const sql = require('./db.js');
const ItemCompra = require('./item_compra');

// comp_id    
// comp_verif 
// comp_fpago 
// comp_mpago 
// comp_estado 
// usuario_id 
// empleado_id
// ses_id	  
// updated_at 
// created_at 

const INSERT =
    'INSERT INTO compras (comp_verif, comp_fpago, comp_mpago, comp_estado, usuario_id, ses_id, created_at, updated_at) ' +
    ' VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())';

const UPDATE =
    'UPDATE compras SET comp_verif = ?, comp_fpago = ?, comp_mpago = ?, comp_estado = ?, ' +
    'updated_at = NOW() WHERE comp_id = ?';

const GETLASTBYUSER = 
    'SELECT * FROM compras WHERE usuario_id = ? ORDER BY updated_at DESC limit 1';

const GETALLBYUSER = 
    'SELECT * FROM compras WHERE usuario_id = ? ORDER BY updated_at DESC';

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

Compra.lastByUser = (user_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GETLASTBYUSER, [user_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(-1);
            }
        })
    })
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

module.exports = Compra;