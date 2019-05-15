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

const VerifyQuery = 'SELECT * FROM usuarios WHERE ' + fields.username +
    ' = ? AND ' + fields.password + ' = ? LIMIT 1';

class Usuario {
    constructor(nombre, apellidos, email, username, password, fnac, direccion_id, id = 0, ses_id = 1) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.username = username;
        this.password = password;
        this.fnac = fnac;
        this.direccion_id = direccion_id;
        this.ses_id = ses_id;
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

Usuario.getUserByUsername = function (usrname, result) {
    sql.query("SELECT * FROM usuarios WHERE " + fields.username + assign, usrname, function (err, res) {
        if (err) {
            console.log("error :", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
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
            if (!err && res.length == 1) {
                var user = new Usuario(
                            res[0].usr_nombre, 
                            res[0].usr_apellidos, 
                            res[0].usr_email, 
                            res[0].usr_username,
                            res[0].usr_password, 
                            res[0].usr_fnac,
                            res[0].direccion_id,
                            res[0].usr_id,
                            res[0].ses_id,
                            res[0].usr_admin);
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

module.exports = Usuario