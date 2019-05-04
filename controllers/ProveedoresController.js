'use strict';

var Proveedor = require('../models/proveedor');
var Direccion = require('../models/direccion');
var paginate = require('express-paginate');

exports.listAll = async (req, res) => {
    var rows = await new Proveedor(null,null, null).all();
    console.log(rows);
    res.render('proveedor/listView', {title: 'Proveedores', proveedores: rows});
}

exports.formEditar = async (req, res) => {
    var datos = await Proveedor.findById(req.params.prov_id);
    console.log(datos);
    res.render('proveedor/edit', {title: 'Edita un registro', prov: datos});
}

exports.postEditar = async (req, res) => {
    var prov = new Proveedor(req.body.nombre, req.body.email, req.body.direccion_id, req.body.prov_id);
    var direccion = new Direccion(req.body.calle, req.body.numero, req.body.colonia, 
        req.body.ciudad, req.body.pais, req.body.cp, req.body.direccion_id);
    
    // UPDATE PROVEEDOR
    var prov_update = await prov.update();
    
    // UPDATE DIRECCION
    var dir_update = await direccion.update();
    

    res.redirect('/proveedores/');

}

exports.register = (req, res) => {
    res.render('proveedor/create', {title: 'Registra un proveedor'});
}

exports.registerPost = async (req, response) => {
    var dir_id = await createDireccion(
                            req.body.calle, 
                            req.body.numero, 
                            req.body.colonia, 
                            req.body.ciudad, 
                            req.body.pais,
                            req.body.cp
                        );
    
    let prov = new Proveedor(req.body.nombre, req.body.email, dir_id);
    prov.save((err, res) => {
        if (err) {
            response.json(err);
        } else {
            response.redirect('/proveedores/register');
        }
    });
}

function createDireccion(calle, numero, colonia, ciudad, pais, cp){
    return new Promise((resolve, reject) => {
        let direccion = new Direccion(calle, numero, colonia, ciudad, pais, cp);
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