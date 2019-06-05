'use strict';

const Lote = require('../models/lote');
const Proveedor = require('../models/proveedor');
const Ejemplar = require('../models/ejemplar');
const Libro = require('../models/libro');
const Utils = require("./Utils");
const Tipos = require('../models/tipo_ejemplar');

exports.viewAll = async (req, res) => {

    var lotes = await Lote.listAll();
    
    res.render('lote/allView', {lotes: lotes, isAdmin: Utils.isAdmin(req), nombreUsuario: Utils.getNombreUsuario(req)});
}

exports.detalleView = async (req, res) => {
    let lote = await Lote.get(req.params.id);

    res.render('lote/detalleView', {isAdmin: Utils.isAdmin(req), nombreUsuario: Utils.getNombreUsuario(req)});
}

exports.addView = async (req, res) => {
    let libros = await Libro.getAllLibrosSimple();
    let proveedores = await Proveedor.getAllSimple();
    let tipos = await Tipos.getAll();
    console.log(tipos);
    res.render('lote/addView', {isAdmin: Utils.isAdmin(req), 
        nombreUsuario: Utils.getNombreUsuario(req), libros: libros, 
        proveedores: proveedores, tipos: tipos});
}

// FALTA AGREGAR EL TIPO A CADA EJEMPLAR
// HAY UN ERROR AL INSERTAR UN LOTE
exports.addPost = async (req, res) => {

    let sid = req.session.user.ses_id;
    let descripcion = req.body.descripcionLote;
    let fecha_entrega = req.body.fentrega;
    let proveedor_id = req.body.proveedor_id;
    // LISTAS
    let cantidades = req.body.cantidades;
    let precios = req.body.precios;
    let libros = req.body.libros;
    let tipos = req.body.tipos;

    let lote = new Lote(descripcion, fecha_entrega, proveedor_id, sid);
    let lote_id = await lote.save().catch((reason) => {
        console.log(reason);
    });
    
    console.log("RESULTADO LOTE: ", lote_id);

    for (var index = 0; index < cantidades.length; index++) {
        var utc = Date.now();
        var ejemplar = new Ejemplar(cantidades[index], precios[index], utc, libros[index], lote_id, sid, tipos[index]);
        console.log("RESULTADO EJEMPLAR: ", await ejemplar.save());
    }


    res.send("OK :)");
}
