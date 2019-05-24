'use strict';

const Lote = require('../models/lote');
const Proveedor = require('../models/proveedor');
const Ejemplar = require('../models/ejemplar');
const Libro = require('../models/libro');

// lote.viewAll); X
// min, lote.detalleVi X
// in, lote.addView);
// min, lote.addPost);
// min, lote.editView)
// n, lote.editPost);

exports.viewAll = async (req, res) => {
    let admin = null;
    if (req.session.user)
        admin = req.session.user.isAdmin;

    var lotes = await Lote.
    
    res.render('lote/allView', {lotes: lotes, isAdmin: admin == 1});
}

exports.detalleView = async (req, res) => {
    let lote = await Lote.get(req.params.id);
    let admin = null;
    if (req.session.user)
        admin = req.session.user.isAdmin;

    res.render('lote/detalleView', {lote: lote, isAdmin: admin == 1});
}

exports.addView = (req, res) => {
    res.render('lote/addView');
}
