const Compra = require('../models/compra');
const Usuario = require('../models/usuario');

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
                    total += items[a].precio;
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