'use strict';

var sql = require('./db.js')

// comp_id    
// comp_verif 
// comp_fpago 
// comp_mpago 
// comp_estado 
// usuario_id 
// empleado_id
// ses_id	  i
// updated_at 
// created_at 

const INSERT =
    'INSERT INTO compras (comp_verif, comp_fpago, comp_mpago, comp_estado, usuario_id, ses_id, created_at, updated_at) ' +
    ' VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())';

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
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });

    }
}