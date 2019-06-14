'use strict';

var sql = require('./db.js')

const fields = {
    nombre: 'usr_nombre', apellidos: 'usr_apellidos', email: 'usr_email',
    username: 'usr_username', password: 'usr_password', fnac: 'usr_fnac',
    direccion: 'direccion_id', ses_id: 'ses_id', rol_id: 'roles_id'
};

const comma = ', ';

const assign = ' = ?';

const Insert =
    'INSERT INTO usuarios (' +
    fields.nombre + comma + fields.apellidos + comma + fields.email + comma +
    fields.username + comma + fields.password + comma + fields.fnac + comma +
    fields.direccion + comma + fields.ses_id + comma + fields.rol_id + comma + 'created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

const update =
    'UPDATE Usuarios SET ' + fields.nombre + assign + comma
    + fields.apellidos + assign + comma
    + fields.email + assign + comma
    + fields.username + assign + comma
    + fields.password + assign + comma
    + fields.fnac + assign
    + ' WHERE usr_id = ?';

const UpdatePwd = 'UPDATE usuarios SET ' +
    fields.password + assign + ', updated_at = NOW() WHERE usr_id = ?';

const UpdateUsrname = 'UPDATE usuarios SET ' +
    fields.username + assign + ', updated_at = NOW() WHERE usr_id = ?';

const UpdateNombre = 'UPDATE usuarios SET ' +
    fields.nombre + assign + comma +
    fields.apellidos + assign + ', updated_at = NOW() WHERE usr_id = ?';

const UpdateEmail = 'UPDATE usuarios SET ' +
    fields.email + assign + ', updated_at = NOW() WHERE usr_id = ?';

const UpdateFnac = 'UPDATE usuarios SET ' +
    fields.fnac + assign + ', updated_at = NOW() WHERE usr_id = ?';

const UpdateDireccion = 'UPDATE usuarios SET ' +
    fields.direccion + assign + comma + 'updated_at = NOW() WHERE usr_id = ?';

const Delete = 'DELETE FROM Usuarios WHERE usr_id = ?';

const VerifyQuery = 'CALL proc_loginUser(?, ?);';

const GETPERMISOS = 'SELECT perm.perm_permisos ' +
    'FROM permisos AS perm ' +
    'INNER JOIN usuarios AS usr ON (usr.roles_id = perm.rol_id) ' +
    'WHERE usr.usr_id = ?';

const GETROL = 'SELECT rol.rol_nombre ' +
    'FROM roles AS rol ' +
    'INNER JOIN usuarios AS usr ON (usr.roles_id = rol.rol_id) ' +
    'WHERE usr.usr_id = ?';

const GETCRYPTOPASSWORD = 'SELECT usr_password ' +
    'FROM usuarios ' +
    'WHERE (usr_username = ?) LIMIT 1';

const VerifyAdmin = 'SELECT * FROM usuarios WHERE '
    + fields.username + assign + ' AND '
    + fields.password + assign + ' AND '
    + '';

const GET_CARRITO = "SELECT getCarrito_orAdd(?, ?) AS 'carrito_id'";

class Usuario {
    constructor(nombre, apellidos, email, username, password, fnac, direccion_id, rol_id, ses_id, id = 0, permisos = '', rol = '') {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.username = username;
        this.password = password;
        this.fnac = fnac;
        this.direccion_id = direccion_id;
        this.ses_id = ses_id;
        this.rol_id = rol_id;
        this.permisos = permisos;
        this.rol = rol;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(Insert,
                [this.nombre, this.apellidos, this.email,
                this.username, this.password, this.fnac, this.direccion_id, this.ses_id, this.rol_id],
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
            sql.query(GETPERMISOS, this.id, (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    getRol() {
        return new Promise((resolve, reject) => {
            sql.query(GETROL, this.id, (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }
}

Usuario.getCarrito = (usr_id, ses_id) => {
    return new Promise((resolve, reject) => {
        sql.query(GET_CARRITO, [usr_id, ses_id], (err, res) => {
            if (!err) {
                resolve(res[0].carrito_id);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.getCryptoPassword = (usr_username) => {
    return new Promise((resolve, reject) => {
        sql.query(GETCRYPTOPASSWORD, usr_username, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.getUserById = function (usrId) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM usuarios WHERE usr_id = ?", usrId, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]);
            }
        })
    });
}

Usuario.deleteUser = (usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(Delete, usr_id, (err, res) => {
            if (!err) {
                resolve(res);
            } else { reject(err); }
        })
    });
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
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM usuarios", function (err, res) {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        })
    });
}

Usuario.updateFnac = (fnac, usr_id) => {
    return new Promise((resolve, reject) => {
        console.log(UpdateFnac, [fnac, usr_id]);
        sql.query(UpdateFnac, [fnac, usr_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.updateDir = (dir_id, usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UpdateDireccion, [dir_id, usr_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.updateEmail = (email, usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UpdateEmail, [email, usr_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.updateNombre = (nombre, apellidos, usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UpdateNombre, [nombre, apellidos, usr_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.updateUsername = (newUsername, usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UpdateUsrname, [newUsername, usr_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

Usuario.updatePassword = (newPassword, usr_id) => {
    return new Promise((resolve, reject) => {
        sql.query(UpdatePwd, [newPassword, usr_id], (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }

        });
    });
}

Usuario.login = (username, password) => {
    return new Promise((resolve, reject) => {
        sql.query(VerifyQuery, [username, password], (err, res) => {
            if (!err) {
                console.log(res);
                console.log(err);
                if (res[0].length > 0) {
                    let row = res[0][0];
                    var user = new Usuario(
                        row.nombre,
                        row.apellidos,
                        row.email,
                        row.username,
                        row.password,
                        row.fnac,
                        row.direccion_id,
                        row.rol_id,
                        row.usr_ses_id,
                        row.usr_id,
                        row.permisos,
                        row.rol);
                    resolve(user);
                }
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