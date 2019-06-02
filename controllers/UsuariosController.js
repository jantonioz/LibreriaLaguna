const Usuario = require('../models/usuario.js');
const Direccion = require('../models/direccion.js');
const Sesion = require('../models/sesion');
const moment = require('moment');
const requestIP = require('request-ip');
const utils = require("./Utils");



exports.list_all_users = function (req, res) {
    Usuario.getAllUsuarios(function (err, usr) {
        if (err)
            res.send(err)
        res.render('usuario/lista', { nombreUsuario: utils.getNombreUsuario(req) });
    })
}

exports.formLogin = (req, res) => {
    res.render('usuario/login', { title: 'Login usuario' });
}

exports.login = async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    let user = await Usuario.login(username, password);
    console.log(user);
    if (user == null) {
        res.send("ERROR");
        return;
    }
    console.log("USUARIOS CONTROLLER: OK");

    var now = moment().utcOffset('-0500').format('YYYY-MM-DD HH:mm');
    var expire = moment().utcOffset('-0500').add(2, 'h').format('YYYY-MM-DD HH:mm');
    var timeStampUnix = moment().utcOffset('-0500').format('x');
    var ip = "" + requestIP.getClientIp(req);
    ip = ip.substr(7, 15);
    if (ip == "")
        ip = "LOCALHOST";
    var os = req.useragent.os;

    // ADD A NEW SESSION
    let token = '' + user.id + user.username + user.password + timeStampUnix;
    let newSession = new Sesion(user.id, token, now, expire, ip, os);
    let res_sid = await newSession.save();
    let sid = res_sid[0][0].insertId;
    console.log(sid);
    console.log(user.rol);
    req.session.user =
        {   name: user.nombre, 
            username: user.username, 
            password: user.password, 
            ses_id: sid, 
            token: newSession.token, 
            permisos: user.permisos,
            nombreRol: user.rol
        };

    if (req.body.gobackTo) {
        res.redirect(req.body.gobackTo);
    } else {
        res.redirect('/cuenta');
    }
}

exports.getRegister = function (req, res) {
    let admin = null;
    if (req.session.user)
        admin = req.session.user.isAdmin;
    res.render('usuario/crear', { isAdmin: admin });
}

exports.create_usr = async function (req, res) {
    let ses_id = req.body.ses_id;

    // =============== USUARIO ===================
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var fecha_nacimiento = req.body.fecha_nacimiento;
    var admin = req.body.admin;

    // ================ DIRECCION ================
    var calle = req.body.calle;
    var numero = req.body.numero;
    var colonia = req.body.colonia;
    var ciudad = req.body.ciudad;
    var pais = req.body.pais;

    if (!nombre || !apellidos || !email || !username || !password || !fecha_nacimiento
        || !calle || !numero || !colonia || !ciudad || !pais)
        res.status(400).send({ error: true, message: "ERROR AL CAPTURAR DATOS" });

    let direccion_id = await createDireccion(calle, numero, colonia, ciudad, pais);

    let usuario = new Usuario(nombre, apellidos, email, username, password, fecha_nacimiento, direccion_id);

    usuario.save((err, queryResult) => {
        if (err)
            res.json(err);
        else
            res.redirect('/');
    });
}

function createDireccion(calle, numero, colonia, ciudad, pais) {
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


// CUENTA
exports.userInfo = async (req, res) => {
    let usuario = await Usuario.getUserByUsername(req.session.user.username);
    let sesiones = await Sesion.getAllByUserId(usuario[0].usr_id);
    console.log(usuario);
    res.render('usuario/cuenta', {
        usr: usuario[0], sesiones: sesiones,
        isAdmin: utils.isAdmin(req), nombreUsuario: utils.getNombreUsuario(req)
    });
}


exports.logout = (req, res) => {
    if (req.session && req.session.user && req.cookies.sid) {
        res.clearCookie('sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}

exports.addCarrito = (req, res) => {

}