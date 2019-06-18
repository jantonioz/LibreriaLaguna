const Usuario = require('../models/usuario.js');
const Direccion = require('../models/direccion.js');
const Sesion = require('../models/sesion');
const moment = require('moment');
const requestIP = require('request-ip');
const utils = require("./Utils");
const Rol = require('../models/rol');
const Ejemplar = require('../models/ejemplar');
const Item = require('../models/item_compra');
const paginate = require('express-paginate');

exports.delete = async (req, res) => {
    let usr_id = req.body.to_delete_usr_id;

    let result = await Usuario.deleteUser(usr_id);

    if (result) {
        res.redirect('/usuarios/admin/list');
    }
}

exports.list_all = async (req, res) => {
    let usuarios = await Usuario.getAllUsuarios();

    let itemCount = usuarios.length;
    let pageCount = Math.ceil(itemCount / req.query.limit);

    usuarios = usuarios.slice(req.skip, req.skip + req.query.limit);

    res.render('usuario/usuariosList', {
        title: 'Usuarios', usuarios: usuarios,  pageCount, itemCount,
        pages: paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page),
        actualPage: req.query.page, nombreUsuario: utils.getNombreUsuario(req)
    });
}

exports.formFnac = async (req, res) => {
    let usuario = await Usuario.getUserById(req.session.user.usr_id);
    let fnac = moment(usuario.usr_fnac);
    res.render('usuario/fnacEdit',
        { nombre: usuario.usr_nombre, fnac: fnac.format('YYYY-MM-DD'), usr_id: req.session.user.usr_id });
}

exports.changeFnac = async (req, res) => {
    let usr_id = req.body.usr_id;
    let fnac = req.body.fnac;
    

    let result = await Usuario.updateFnac(fnac, usr_id);
    if (result) {
        
        res.redirect('/cuenta');
        return;
    }
    res.send("ERROR");
}

exports.formDireccion = async (req, res) => {
    let usuario = await Usuario.getUserById(req.session.user.usr_id);
    
    if (usuario.direccion_id != null) {
        let response = await Direccion.getById(usuario.direccion_id);
        let obj = new Direccion(response.dir_calle, response.dir_num,
            response.dir_colonia, response.dir_cd, response.dir_pais,
            response.dir_cp, response.ses_id, response.dir_id);

        return res.render('usuario/direccionEdit',
            {
                calle: obj.calle, numero: obj.numero, colonia: obj.colonia, ciudad: obj.ciudad,
                pais: obj.pais, cp: obj.cp, dir_id: obj.id, nombre: utils.getNombreUsuario(req)
            });
    }
    res.render('usuario/direccionEdit', { nombre: utils.getNombreUsuario(req) });
}

exports.changeDir = async (req, res) => {
    let dir_id = req.body.dir_id;
    let usr_id = req.session.user.usr_id;
    var calle = req.body.calle;
    var numero = req.body.numero;
    var colonia = req.body.colonia;
    var ciudad = req.body.ciudad;
    var pais = req.body.pais;
    var cp = req.body.cp;

    let direccion = new Direccion(calle, numero, colonia, ciudad, pais, cp, req.session.user.ses_id, dir_id);

    if (dir_id) {
        let result = await direccion.update();
        if (result) {
            res.redirect('/cuenta');
            return;
        } else {
            res.send("ERROR");
        }
    } else {
        let result = await direccion.save();
        let updteUsr = await Usuario.updateDir(result, usr_id).catch((reason) => {
            console.log(reason);
        });

        if (result && updteUsr) {
            res.redirect('/cuenta');
            return;
        } else {
            res.send("ERROR");
        }
    }
}

exports.formEmail = async (req, res) => {
    let usuario = await Usuario.getUserById(req.session.user.usr_id);
    let email = usuario.usr_email;
    res.render('usuario/emailEdit',
        { nombre: utils.getNombreUsuario(req), email: email, usr_id: req.session.user.usr_id });
}

exports.changeEmail = async (req, res) => {
    let usr_id = req.body.usr_id;
    let newEmail = req.body.newEmail;

    let result = await Usuario.updateEmail(newEmail, usr_id);
    if (result) {
        res.redirect('/cuenta');
        return;
    }
    res.send("ERROR");
}

exports.formNombre = async (req, res) => {
    let usuario = await Usuario.getUserById(req.session.user.usr_id);
    let nombre = usuario.usr_nombre;
    let apellids = usuario.usr_apellidos;

    res.render('usuario/nameEdit',
        { nombre: nombre, apellidos: apellids, usr_id: req.session.user.usr_id });
}

exports.changeNombre = async (req, res) => {
    let usr_id = req.body.usr_id;
    let nombres = req.body.newName;
    let apellidos = req.body.newApellidos;

    let result = await Usuario.updateNombre(nombres, apellidos, usr_id);

    if (result) {
        res.redirect('/cuenta');
        return;
    }
    res.send("ERROR");
}

exports.formUsername = async (req, res) => {
    res.render('usuario/usernameEdit', { nombre: utils.getNombreUsuario(req), usr_id: req.session.user.usr_id });
}

exports.changeUsername = async (req, res) => {
    let usr_id = req.body.usr_id;
    let newUsername = req.body.newUsername;

    let result = await Usuario.updateUsername(newUsername, usr_id);
    
    if (result) {
        req.session.user.username = newUsername;
    }

    res.redirect('/cuenta');
}

exports.formPassword = async (req, res) => {
    res.render('usuario/pwdEdit', { nombre: utils.getNombreUsuario(req), usr_id: req.session.user.usr_id });
}

exports.changePassword = async (req, res) => {
    let usr_id = req.body.usr_id;
    let newPassword = req.body.password;
    let repPassword = req.body.password2;
    if (newPassword != repPassword) {
        res.render('usuario/pwdEdit', { usr_id: req.session.user.usr_id });
        return;
    }

    let encPassword = await utils.crypt(newPassword);

    let result = await Usuario.updatePassword(encPassword, usr_id);

    
    res.redirect('/cuenta');
}

exports.list_all_users = function (req, res) {

}

exports.formLogin = (req, res) => {
    res.render('usuario/login', { title: 'Login usuario' });
}

exports.login = async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    let user = await Usuario.login(username, password);
    if (user == null) {

        let cryptoPass = await Usuario.getCryptoPassword(username);
        cryptoPass = cryptoPass[0].usr_password;
        let same = await utils.compare(cryptoPass, password);

        if (same) {
            user = await Usuario.login(username, cryptoPass);
        } else {
            res.send("ERROR");
            return;
        }
        if (user == null) {
            res.send("ERROR");
            return;
        }
    }

    

    var now = moment().utcOffset('-0500').format('YYYY-MM-DD HH:mm');
    var expire = moment().utcOffset('-0500').add(2, 'h').format('YYYY-MM-DD HH:mm');
    var timeStampUnix = moment().utcOffset('-0500').format('x');
    var ip = "" + requestIP.getClientIp(req);
    ip = ip.substr(7, 15);
    if (ip == "")
        ip = "LOCALHOST";
    var os = req.useragent.os;

    // ADD A NEW SESSION
    let token = '' + user.id + user.username + timeStampUnix;
    let newSession = new Sesion(user.id, token, now, expire, ip, os);
    let res_sid = await newSession.save();
    let sid = res_sid[0][0].insertId;
    req.session.user =
        {
            name: user.nombre,
            usr_id: user.id,
            username: user.username,
            //password: user.password,
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
    // =============== USUARIO ===================
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var fecha_nacimiento = req.body.fecha_nacimiento;

    if (!nombre || !apellidos || !email || !username || !password || !fecha_nacimiento) {
        return res.status(400).send({ error: true, message: "ERROR AL CAPTURAR DATOS" });
    }

    let tempDir = null;
    let normalUser_id = 4;
    let usuario = new Usuario(nombre, apellidos, email, username, password, fecha_nacimiento, tempDir, normalUser_id, 1);
    let result = usuario.save();
    if (!result)
        res.json(err);
    else
        res.redirect('/cuenta');
}

exports.getRegisterWAdmin = async (req, res) => {
    console.log("Reg admin");
    let sesiones = null;
    let roles = await Rol.getAll();
    res.render('usuario/createAdmin', {
        sesiones: sesiones, nombreUsuario: utils.getNombreUsuario(req),
        roles: roles
    });
}

exports.create_usrWAdmin = async (req, res) => {
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let fnac = req.body.fecha_nacimiento;
    let rol_id = req.body.rol_id;
    let ses_id = req.session.user.ses_id;

    let admin = new Usuario(nombre, apellidos, email, username, password, fnac, null, rol_id, ses_id);
    let admin_insert = await admin.save();
    console.log(admin_insert);
    res.send("OK :)");
}

function createDireccion(calle, numero, colonia, ciudad, pais, cp, ses_id) {
    return new Promise((resolve, reject) => {
        let direccion = new Direccion(calle, numero, colonia, ciudad, pais, cp, ses_id);
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
    let id = req.session.user.usr_id;
    let dir = await Direccion.getByUser(id);
    dir = dir[0];

    let itemCount = sesiones.length;
    let pageCount = Math.ceil(itemCount / req.query.limit);
    sesiones = sesiones.slice(req.skip, req.skip + req.query.limit);

    res.render('usuario/cuenta', {
        usr: usuario[0], 
        sesiones: sesiones,
        pageCount: itemCount, 
        pages: paginate.getArrayPages(req)(req.query.limit, pageCount, req.query.page),
        actualPage: req.query.page,
        isAdmin: utils.isAdmin(req), 
        nombreUsuario: utils.getNombreUsuario(req),
        direccion: dir
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

exports.addCarrito = async (req, res) => {
    let ejemplar_id = req.body.ejemplar;
    console.log(ejemplar_id);
    let cantidad = req.body.cantidad;
    let usr_id = req.session.user.usr_id;
    let sid = req.session.user.ses_id;

    // OBTENER CARRITO DEL USUARIO
    let carrito_id = await Usuario.getCarrito(usr_id, sid);

    // OBTENER EJEMPLAR
    let ejem = await Ejemplar.getById(ejemplar_id).catch((reason) => {
        console.log(reason);
    });
    console.log(carrito_id);
    console.log(ejem);

    if (carrito_id && ejem) {
        // AGREGAR ejemplar a item compra
        let item = new Item(cantidad, ejem.ejem_precio, ejemplar_id, carrito_id, sid);
        let result = await item.save();
        console.log(result);
        res.redirect('/cuenta');
    }
    res.redirect('/');
}