'use strict';

var sql = require('./db.js')

const Insert = 'INSERT into Usuarios(us_nombre, us_apellidos, us_email, us_email, us_username, us_password, us_fecha_nacimiento, VALUES(?,?,?,?,?,?))';
const update = 'UPDATE Usuarios SET us_nombre = ?, us_email = ?, us_username = ?, us_password = ?, us:fecha_nacimiento = ?' + 
               'WHERE us_nombr = ?';
const Delete = 'DELETE from Usuarios WHERE us_nombre = ?';

class usuario {
    constructor(nombre, apellidos, email, username, password, fecha_nacimiento){
    //this.ID = usr.id,
    this.nombre = nombre
    this.apellidos = apellidos
    this.email = email
    this.username = username
    this.password = password
    this.fecha_nacimiento = fecha_nacimiento
    //this.direccion_id = usr.direccion_id,
  }


    save(result){
      sql.query(Insert, 
        [this.nombre, this.apellidos,this.email, 
        this.username, this.password, this.fecha_nacimiento],
         (err, res) => {
             if(err){
                console.log("ERROR:", err);
                result(err, null);
            } else {
           result(null, res);
       }
   })
  }

  update(result){
    sql.query(update,
        [this.nombre, this.apellidos,this.email, 
        this.username, this.password, this.fecha_nacimiento],
        (err, res) => {
            if (err) {
                console.log("error :", err)
                result(err, null)
            } else {
                console.log(res)
                result(null, res)
            }
        });
}

    delete(result){
        sql.query(Delete, [this.nombre, this.apellidos,this.email, 
            this.username, this.password, this.fecha_nacimiento],
        (err, res) =>{
            if(err){
                console.log("Error: ", err)
                result(err,null)
            } else {
                console.log(res)
                result(null, res)
            }
        })
    }

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