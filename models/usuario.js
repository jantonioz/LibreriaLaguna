'use strict';

var sql = require('./db.js')

const fields = {
    nombre: 'usr_nombre', apellidos: 'usr_apellidos', email: 'usr_email',
    username: 'usr_username', password: 'usr_password', fnac: 'usr_fnac'
};

const comma = ', ';

const assign = ' = ?';

const Insert =
    'INSERT INTO usuarios (' + fields.nombre + comma + fields.apellidos + comma + fields.email + comma +
    fields.username + comma + fields.password + comma + fields.fnac + ') VALUES (?, ?, ?, ?, ?, ?)';

const update =
    'UPDATE Usuarios SET ' + fields.nombre + assign + comma
    + fields.apellidos + assign + comma
    + fields.email + assign + comma
    + fields.username + assign + comma
    + fields.password + assign + comma
    + fields.fnac + assign
    + ' WHERE usr_id = ?';

const Delete = 'DELETE FROM Usuarios WHERE usr_id = ?';

class Usuario {
    constructor(nombre, apellidos, email, username, password, fnac, id = 0) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.username = username;
        this.password = password;
        this.fnac = fnac;
    }

    save(result) {
        sql.query(Insert,
            [this.nombre, this.apellidos, this.email,
            this.username, this.password, this.fnac],
            (err, res) => {
                if (err) {
                    console.log("ERROR:", err);
                    result(err, null);
                } else {
                    result(null, res);
                }
            });
    }

    update(result) {
        sql.query(update,
            [this.nombre, this.apellidos, this.email,
            this.username, this.password, this.fnac, this.id],
            (err, res) => {
                if (err) {
                    console.log("error :", err);
                    result(err, null);
                } else {
                    console.log(res);
                    result(null, res);
                }
            }
        );
    }

    delete(result) {
        sql.query(Delete, [this.id],
            (err, res) => {
                if (err) {
                    console.log("Error: ", err);
                    result(err, null);
                } else {
                    console.log(res);
                    result(null, res);
                }
            }
        );
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

module.exports = Usuario