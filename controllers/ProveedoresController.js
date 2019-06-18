'use strict';

const Proveedor = require('../models/proveedor');
const Direccion = require('../models/direccion');
const Lote = require('../models/lote');
const moment = require('moment')
const paginate = require('express-paginate');

exports.detalle = async(req, res) => {
    const prov = await Proveedor.findById(req.params.proveedor_id);

    let lotes = await Lote.getByProv(req.params.proveedor_id);
    
    lotes = lotes.map(lote => {
        return {
            lot_id: lote.lot_id,
            lote_descripcion: lote.lote_descripcion,
            fentrega: moment(lote.fentrega).format('DD/MM/YYYY'),
            ses_id: lote.ses_id
        };
    });

    res.render('proveedor/detalle', {
        proveedor: prov,
        lotes: lotes
    });
}

exports.listAll = async (req, res) => {
    var rows = await new Proveedor(null, null, null).all();
    
    res.render('proveedor/listView', { title: 'Proveedores', proveedores: rows });
}

exports.formEditar = async (req, res) => {
    var datos = await Proveedor.findById(req.params.prov_id);
    
    res.render('proveedor/edit', { title: 'Edita un registro', prov: datos });
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
    res.render('proveedor/create', { title: 'Registra un proveedor' });
}

exports.registerPost = async (req, response) => {
    let sid = req.session.user.ses_id;
    var dir_id = await createDireccion(
        req.body.calle,
        req.body.numero,
        req.body.colonia,
        req.body.ciudad,
        req.body.pais,
        req.body.cp,
        sid
    );

    let prov = new Proveedor(req.body.nombre, req.body.email, dir_id, sid);
    let prov_insert = await prov.save();
    response.json(prov_insert);
}

async function createDireccion(calle, numero, colonia, ciudad, pais, cp, sid) {
    return new Promise(async (resolve, reject) => {
        let direccion = new Direccion(calle, numero, colonia, ciudad, pais, cp, sid);
        let dir_id = await direccion.save();
        resolve(dir_id);
    });
}

