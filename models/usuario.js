'use strict';

var sql = require('./db.js')

var Usuario = function (nombre, apellidos, email, username, password, fecha_nacimiento) {
    //this.ID = usr.id,
    this.nombre = nombre
    this.apellidos = apellidos
    this.email = email
    this.username = username
    this.password = password
    this.fecha_nacimiento = fecha_nacimiento
    //this.direccion_id = usr.direccion_id,
}

Usuario.crearUsuario = function crearUsuario(usr, result) {
    // CAMBIA EL QUERY, ya no se llaman así los campos
    let query = "INSERT INTO usuarios(nombre, apellidos, " +
        "email, username, password, fecha_nacimiento)" +
        "VALUES (?,?,?,?,?,?)";
    sql.query(query, [usr.nombre, usr.apellidos, usr.email, usr.username,
    usr.password, usr.fecha_nacimiento, 0],
        function (err, res) {
            if (err) {
                console.log("error :", err)
                result(err, null)
            } else {
                console.log(res.insertId)
                result(null, res.insertId)
            }
        })
}


Usuario.getUserById = function (usrId, result) {
    sql.query("SELECT * FROM usuarios WHERE ID = ?", usrId, function (err, res) {
        if (err) {
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}


Usuario.getUserByUsername = function (usrname, result) {
    sql.query("SELECT * FROM usuarios WHERE nombreusuario = ?", usrname, function (err, res) {
        if (err) {
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Usuario.getAllUsuarios = function getAllLibros(result) {
    sql.query("SELECT * FROM libros " +
        "AS lib INNER JOIN generos AS gen ON (lib.genero_id = gen.id) ", function (err, res) {
            if (err) {
                console.log("error: ", err)
                result(null, err)
            } else {
                result(null, res)
            }
        })
}

module.exports = Usuario