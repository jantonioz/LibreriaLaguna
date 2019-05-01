'use strict';

var Proveedor = require('../models/proveedor');
var Direccion = require('../models/direccion');

exports.register = (req, res) => {
    res.render('proveedor/create', {title: 'Registra un proveedor'});
}

exports.registerPost = async (req, response) => {
    var dir_id = await createDireccion(
                            req.body.calle, 
                            req.body.numero, 
                            req.body.colonia, 
                            req.body.ciudad, 
                            req.body.pais
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