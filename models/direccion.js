'use strict';

var sql = require('./db.js')

const fields = {
    calle: 'dir_calle', numero: 'dir_num', colonia: 'dir_colonia',
    ciudad: 'dir_cd', pais: 'dir_pais', cp: 'dir_cp'
};

const assign = ' = ?';
const comma = ', ';

const INSERT = 'INSERT INTO direcciones(' + fields.calle + comma +
    fields.numero + comma + fields.colonia + comma + fields.ciudad + comma +
    fields.pais + comma + fields.cp + comma + 'created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';

const UPDATE = 'UPDATE direcciones SET ' +
            fields.calle + assign + comma +
            fields.numero + assign + comma +
            fields.colonia  + assign + comma +
            fields.ciudad + assign + comma +
            fields.pais  + assign + comma +
            fields.cp + assign + 
            ' WHERE dir_id' + assign;

class Direccion {
    constructor(calle, numero, colonia, ciudad, pais, cp, id = 0) {
        this.calle = calle;
        this.numero = numero;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.pais = pais;
        this.cp = cp;
        this.id = id;
    }

    save(result) {
        sql.query(INSERT, [this.calle, this.numero, this.colonia, this.ciudad, this.pais, this.cp],
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
            sql.query(UPDATE, [this.calle, this.numero, this.colonia, this.ciudad, this.pais, this.cp, this.id],
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