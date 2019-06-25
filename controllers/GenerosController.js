'use strict';

var Genero = require('../models/genero');


exports.list_all_generos = async (req, res) => {
    let rows = await Genero.getAll();
    console.log(rows);

    res.render('genero/listView', 
        {title: 'Generos', generos: rows}
    );
}

exports.getLibrosBy = async (req, res) => {
    let libros = await Genero.booksBy(req.params.gen_id);
    let genero = await Genero.findById(req.params.gen_id);
    let nombreGen = genero[0].genero;
    console.log(libros);

    if (libros.length > 0)
        res.render('genero/listLibros', 
        { title: nombreGen, libros: libros, genero: nombreGen });
    else
        res.render('genero/listLibros', 
        { title: 'Sin libros por ahora', genero: nombreGen });
}

exports.formCrear = (req, res) => {
    res.render('genero/crear', { title: 'Crea un genero' })
}

exports.create = async (req, res) => {
    let newGenero = new Genero(req.body.nombre, req.body.descripcion, req.session.user.ses_id);
    let insertId = await newGenero.save();

    res.json({ id: insertId });
}