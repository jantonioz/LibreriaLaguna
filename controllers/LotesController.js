'use strict';

const Lote = require('../models/lote');
const Proveedor = require('../models/proveedor');
const Ejemplar = require('../models/ejemplar');
const Libro = require('../models/libro');
const Utils = require("./Utils");

// lote.viewAll); X
// min, lote.detalleVi X
// in, lote.addView);
// min, lote.addPost);
// min, lote.editView)
// n, lote.editPost);

exports.viewAll = async (req, res) => {

    var lotes = await Lote.listAll();
    
    res.render('lote/allView', {lotes: lotes, isAdmin: Utils.isAdmin(req), nombreUsuario: Utils.getNombreUsuario(req)});
}

exports.detalleView = async (req, res) => {
    let lote = await Lote.get(req.params.id);

    res.render('lote/detalleView', {isAdmin: Utils.isAdmin(req), nombreUsuario: Utils.getNombreUsuario(req)});
}

exports.addView = (req, res) => {
    res.render('lote/addView', {isAdmin: Utils.isAdmin(req), nombreUsuario: Utils.getNombreUsuario(req)});
}

exports.addPost = (req, res) => {
    res.json(req.body);
}
