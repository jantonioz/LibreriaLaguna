'use strict';

var sql = require('./db.js')

const fields = {
    calle: 'dir_calle', numero: 'dir_num', colonia: 'dir_colonia',
    ciudad: 'dir_cd', pais: 'dir_pais', cp: 'dir_cp', ses_id: 'ses_id'
};

const assign = ' = ?';
const comma = ', ';

const INSERT = 'INSERT INTO direcciones(' + 
    fields.calle + comma +
    fields.numero + comma + 
    fields.colonia + comma + 
    fields.ciudad + comma +
    fields.pais + comma + 
    fields.cp + comma + 
    fields.ses_id + comma + 'created_at, updated_at VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

const UPDATE = 'UPDATE direcciones SET ' +
            fields.calle + assign + comma +
            fields.numero + assign + comma +
            fields.colonia  + assign + comma +
            fields.ciudad + assign + comma +
            fields.pais  + assign + comma +
            fields.cp + assign + 
            fields.ses_id + assign +
            ' WHERE dir_id' + assign;

class Direccion {
    constructor(calle, numero, colonia, ciudad, pais, cp, ses_id, id = 0) {
        this.calle = calle;
        this.numero = numero;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.pais = pais;
        this.cp = cp;
        this.id = id;
        this.ses_id = ses_id;
    }

    save(result) {
        sql.query(INSERT, [this.calle, this.numero, this.colonia, this.ciudad, this.pais, this.cp, this.ses_id],
            (err, res) => {
                if (err) {
                    console.log("ERROR: ", err);
                    result(err, null);
                }
                else {
                    result(null, res);
                }
            }
        );
    }

    update() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [this.calle, this.numero, this.colonia, this.ciudad, this.pais, this.cp, this.ses_id, this.id],
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

module.exports = Direccion;