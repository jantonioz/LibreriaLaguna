'use strict';

var sql = require('./db.js');

const INSERT = 
'INSERT INTO sesiones(ses_token, ses_ultima_act, ses_fin, ses_ip, ses_os, usr_id, ' +
'updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW());'

class Sesion{
    constructor(user_id, ses_token, ses_utlima_actividad = '1990-01-01 00:00', ses_fin = '1990-01-01 00:00', ses_ip = '0.0.0.0', ses_os = 'windows', ses_id=0) {
        this.user_id = user_id;
        this.token = ses_token;
        this.ultima_act = ses_utlima_actividad;
        this.fin = ses_fin;
        this.ip = ses_ip;
        this.os = ses_os;
        this.id = ses_id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.token, this.ultima_act, this.fin, this.ip, this.os, this.user_id], (err, res) =>  {
                if (!err) 
                    resolve(res.insertId);
                else 
                    reject(err);
            });
        });
    }
}

module.exports = Sesion;