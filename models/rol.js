
const sql = require('./db');

const SELECTBYID = 'SELECT * FROM roles WHERE rol_id = ?';
const GETBYUSER = 'SELECT rol.rol_nombre FROM roles as rol ' +
    'INNER JOIN usuarios AS usr ON (usr.roles_id = rol.rol_id) ' +
    'WHERE usr.usr_id = ?';
const SELECTALL = 'SELECT * FROM roles';

const INSERT = 'INSERT INTO roles (rol_nombre, ses_id, created_at, updated_at) ' +
    'VALUES(?, ?, NOW(), NOW())';

class Rol{
    constructor(nombre, ses_id = 0, id = 0) {
        this.nombre = nombre;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.nombre, this.ses_id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }
}

Rol.getByUser = (usr_id) => {
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