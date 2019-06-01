'use strict';

var sql = require('./db.js')

const fields = {
    nombre: 'usr_nombre', apellidos: 'usr_apellidos', email: 'usr_email',
    username: 'usr_username', password: 'usr_password', fnac: 'usr_fnac',
    direccion: 'direccion_id', ses_id: 'ses_id'
};

const comma = ', ';

const assign = ' = ?';

const Insert =
    'INSERT INTO usuarios (' +
    fields.nombre + comma + fields.apellidos + comma + fields.email + comma +
    fields.username + comma + fields.password + comma + fields.fnac + comma +
    fields.direccion + comma + 'ses_id , created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

const update =
    'UPDATE Usuarios SET ' + fields.nombre + assign + comma
    + fields.apellidos + assign + comma
    + fields.email + assign + comma
    + fields.username + assign + comma
    + fields.password + assign + comma
    + fields.fnac + assign
    + ' WHERE usr_id = ?';

const Delete = 'DELETE FROM Usuarios WHERE usr_id = ?';

// usr_nombre,
// usr_apellidos,
// usr_email,
// usr_username,
// usr_password,
// usr_fnac,
// direccion_id,
// usr_id,
// ses_id,
// permisos);

const VerifyQuery = 'CALL proc_loginUser(?, ?);';

const GETPERMISOS = 'SELECT perm.perm_permisos ' +
                    'FROM permisos AS perm ' +
                    'INNER JOIN usuarios AS usr ON (usr.roles_id = perm.rol_id) ' +
                    'WHERE usr.usr_id = ?';

const VerifyAdmin = 'SELECT * FROM usuarios WHERE '
    + fields.username + assign + ' AND '
    + fields.password + assign + ' AND '
    + 'usr_admin = 1 LIMIT 1';

class Usuario {
    constructor(nombre, apellidos, email, username, password, fnac, direccion_id, id = 0, ses_id = 1, permisos = '') {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.username = username;
        this.password = password;
        this.fnac = fnac;
        this.direccion_id = direccion_id;
        this.ses_id = ses_id;
        this.permisos = permisos;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(Insert,
                [this.nombre, this.apellidos, this.email,
                this.username, this.password, this.fnac, this.direccion_id, this.ses_id],
                (err, res) => {
                    if (err) {
                        console.log("ERROR:", err);
                        reject(err);
                    } else {
                        resolve(res);
                    }
                }
            );
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            sql.query(update,
                [this.nombre, this.apellidos, this.email,
                this.username, this.password, this.fnac, this.id],
                (err, res) => {
                    if (err) {
                        console.log("error :", err);
                        reject(err);
                    } else {
                        console.log(res);
                        resolve(res);
                    }
                }
            );
        });

    }

    delete() {
        return new Promise((resolve, reject) => {
            sql.query(Delete, [this.id],
                (err, res) => {
                    if (err) {
                        console.log("Error: ", err);
                        reject(err);
                    } else {
                        console.log(res);
                        resolve(res);
                    }
                }
            );
        });
    }

    getPermisos() {
        return new Promise((resolve, reject) => {
            sql.query(GETPERMISOS, this.id, )
        });
    }
}

Usuario.getUserById = function (usrId, result) {
    sql.query("SELECT * FROM usuarios WHERE ID = ?", usrId, function (err, res) {
        if (err) {
            console.log("error :", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

Usuario.getUserByUsername = function (usrname) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM usuarios WHERE usr_username = ? LIMIT 1;", [usrname], function (err, res) {
            if (err) {
                resolve(null);
            } else {
                resolve(res);
            }
        });
    });
}

Usuario.getAllUsuarios = function getAllLibros(result) {
    sql.query("SELECT * FROM usuarios", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    })
}

Usuario.login = (username, password) => {
    return new Promise((resolve, reject) => {
        sql.query(VerifyQuery, [username, password], (err, res) => {
            console.log(res);
            console.log(err);
            if (res) {
                let row = res[0][0];
                var user = new Usuario(
                    row.nombre,
                    row.apellidos,
                    row.email,
                    row.username,
                    row.password,
                    row.fnac,
                    row.direccion_id,
                    row.usr_id,
                    0,
                    row.permisos);
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

Usuario.verify = (username, password, result) => {
    sql.query(VerifyQuery, [username, password], (err, res) => {
        if (err) {
            result(err, null);
        } else if (res.length == 1) {
            result(null, res);
        } else {
            result(null, null);
        }
    });
}

Usuario.verifyAdmin = (username, password, callback) => {
    // NO PROMISE ALLOWED ON MIDDLEWARE
    sql.query(VerifyAdmin, [username, password], (err, res) => {
        if (!err) {
            if (res.length == 1 && res[0].usr_admin[0] == 1) {
                console.log(res);
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}

module.exports = Usuario