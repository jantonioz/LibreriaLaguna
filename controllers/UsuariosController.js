'use strict';

var Usuario = require('../models/usuario.js');
var Direccion = require('../models/direccion.js');


exports.list_all_users = function(req, res){
    Usuario.getAllUsuarios(function(err, usr){
        if (err)
            res.send(err)
        res.render('usuario/lista');
    })
}   

exports.formLogin = (req, res) => {
    res.render('usuario/login', {title: 'Login usuario'});
}

exports.login = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    

    Usuario.verify(username, password, (err, usuario) => {
        if (!err && usuario) {
            
            req.session.user = usuario[0];
            res.redirect('/');
        } else
            res.send("ERROR");
    });
}

exports.getRegister = function(req, res){
    res.render('usuario/crear');
}

exports.create_usr = async function(req, res){
    // =============== USUARIO ===================
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var fecha_nacimiento = req.body.fecha_nacimiento;

    // ================ DIRECCION ================
    var calle = req.body.calle;
    var numero = req.body.numero;
    var colonia = req.body.colonia;
    var ciudad = req.body.ciudad;
    var pais = req.body.pais;

    if (!nombre || !apellidos || !email || !username || !password || !fecha_nacimiento 
        || !calle || !numero || !colonia || !ciudad || !pais)
        res.status(400).send({error: true, message: "ERROR AL CAPTURAR DATOS"});

    let direccion_id = await createDireccion(calle, numero, colonia, ciudad, pais);
    
    let usuario = new Usuario(nombre, apellidos, email, username, password, fecha_nacimiento, direccion_id);

    usuario.save((err, queryResult) => {
        if (err)
            res.json(err);
        else
            res.redirect('/');
    });
}

function createDireccion(calle, numero, colonia, ciudad, pais){
    return new Promise((resolve, reject) => {
        let direccion = new Direccion(calle, numero, colonia, ciudad, pais);
        direccion.save((err, res) => {
            if (err)
                console.log("ERROR: ", err);
            else {
                console.log(res);
                resolve(res.insertId);
            }
        });
    });
}


exports.userInfo = (req, res) => {
    res.json({cookie: req.cookies.sid, session: req.session.user});
}


exports.logout = (req, res) => {
    if (req.session && req.session.user && req.cookies.sid) {
        res.clearCookie('sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}