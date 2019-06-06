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
    fields.ses_id + comma + 'created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

const GETBYUSER = 'SELECT dir.dir_id AS id, dir.dir_calle AS calle, dir.dir_num AS num, ' +
    'dir.dir_colonia AS colonia, dir.dir_cd AS ciudad, dir.dir_cp AS cp, dir.dir_pais AS pais ' +
    'FROM direcciones AS dir ' + 
    'INNER JOIN usuarios AS usr ON (usr.direccion_id = dir.dir_id) ' + 
    'WHERE usr.usr_id = ?';

const UPDATE = 'UPDATE direcciones SET ' +
            fields.calle + assign + comma +
            fields.numero + assign + comma +
            fields.colonia  + assign + comma +
            fields.ciudad + assign + comma +
            fields.pais  + assign + comma +
            fields.cp + assign + comma +
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

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.calle, this.numero, this.colonia, this.ciudad, this.pais, this.cp, this.ses_id],
                (err, res) => {
                    if (!err) {
                        resolve(res.insertId);
                    } else  {
                        resolve(-1);
                    }
                }
            );
        });
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

Direccion.getById = (dir_id) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM direcciones WHERE dir_id = ?', dir_id, (err, res) => {
            if (!err) {
                resolve(res[0]);
                res = res[0];
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Direccion.getByUser = (usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GETBYUSER, usr_id, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = Direccion;