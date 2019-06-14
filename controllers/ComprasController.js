const Compra = require('../models/compra');
const Usuario = require('../models/usuario');
const Ejemplar = require('../models/ejemplar');
const Item = require('../models/item_compra');

exports.changeCompra = async (req, res) => {
    let comp_id = req.body.comp_id;
    let fpago = req.body.fpago;
    let mpago = req.body.mpago;

    let transporte_id = req.body.transporte_id;
    
    let cantidades = req.body.cantidades;
    let items_id = req.body.item_id;
    let ejemplares_id = req.body.ejemplar_id;
    let eliminar = req.body.eliminar;
    // UPDATE COMPRA
    let resultCompra = await Compra.update(fpago, mpago, transporte_id, comp_id).catch((reason) => {
        return res.send("ERROR AL ACTUALIZAR COMPRA", reason);
    });

    // UPDATE ITEMS
    for(var i = 0; i < cantidades.length; i++) {
        // OBTENER EL PRECIO DEL EJEMPLAR
        let ejemplar = await Ejemplar.getById(ejemplares_id[i]);
        let newPrecio = ejemplar.ejem_precio;
        let result = null;
        
        if (eliminar[i] == 'true') {
            console.log("ELIMINANDO ITEM", items_id[i]);
            result = await Item.remove(items_id[i]);
        } else {
            console.log("ACTUALIZANDO ITEM", items_id[i]);
            result = await Item.update(items_id[i], cantidades[i], newPrecio, ejemplares_id[i]);
        }
        if (result == null) {
            return res.send("ERROR AL ACTUALIAR ITEMS");
        }
    }


    return res.redirect('/compras');
}

exports.formEditar = async (req, res) => {
    let comp_id = req.params.compId;
    let usr_id = req.session.user.usr_id;
    let usuario = await Usuario.getUserById(req.session.user.usr_id);

    let compra = await Compra.lastByUser(usr_id).catch((reason) => {
        console.log(reason);
        res.send("ERROR");
    });

    let items = await Compra.getItems(comp_id);
    let ejemplares = await Ejemplar.getAllWithLibro(); 

    let transportes = await Compra.getTransportes();

    for (var i = 0; i < items.length; i ++) {
        items[i].ejemplares = ejemplares;
    }
    
    res.render('compra/editView', 
    {compra: compra, items: items, nombreUsuario: usuario.usr_nombre, 
    transportes: transportes});
    
}

exports.listAll = async (req, res) => {
    let compras = await Compra.getAllByUserComplete(req.session.user.usr_id).catch((reason) => {
        console.log(reason);
    });

    if (compras) {
        for(var i = 0; i < compras.length; i++) {
            let comp_id = compras[i].comp_id;

            let items = await Compra.getItems(comp_id);
            if (items) {
                compras[i].items = items;
                let total = 0;
                for (var a = 0; a < items.length; a++) {
                    total += items[a].precio * items[a].cantidad;
                }
                compras[i].total = total;
            }
        }
    }

    let usuario = await Usuario.getUserById(req.session.user.usr_id);
    console.log(compras);

    res.render('compra/userData', {compras: compras, nombre: usuario.usr_nombre});

}

exports.finalizar = async (req, res) => {

    let usr_id = req.session.user.usr_id;
    let sid = req.session.user.ses_id;

    let result = Compra.finalizar(usr_id, sid);

    if (result) {
        res.redirect('/cuenta');
    } else {
        res.redirect('/compras');
    }
}