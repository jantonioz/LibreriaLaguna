'use strict';

var Genero = require('../models/genero');


exports.list_all_generos = (req, res) => {
    Genero.find((err, rows) => {
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('genero/listView', { title: 'Generos', generos: rows })
    })
}

exports.getLibrosBy = async (req, res) => {
    let libros = await Genero.booksBy(req.params.gen_id);
    let genero = await Genero.findById(req.params.gen_id);
    let nombreGen = genero[0].genero;
    console.log(libros);

    if (libros.length > 0)
        res.render('genero/listLibros', { title: nombreGen, libros: libros, genero: nombreGen });
    else
        res.render('genero/listLibros', { title: 'Sin libros por ahora', genero: nombreGen });

    // Genero.booksBy(req.params.gen_id, (err, rows) => {
    //     if (err) {
    //         res.send(err);
    //         return;
    //     }

    //     Genero.findById(req.params.gen_id, (err, nombreGen) => {
    //         console.log(nombreGen[0].genero);
    //         nombreGen = nombreGen[0].genero;

    //         for (let i = 0; i < rows.length; i++) {
    //             if (typeof rows[i].imgdata !== 'undefined' && rows[i].imgdata != null) {
    //                 console.log(rows[i].imgdata)
    //                 let tempbin = rows[i].imgdata;
    //                 let data64 = Buffer.from(tempbin, 'binary').toString('base64');
    //                 rows[i].imgdata = data64;
    //                 console.log(rows[i].imgdata);
    //             }
    //         }

    //         if (rows.length > 0)
    //             res.render('genero/listLibros', { title: rows[0].genero, libros: rows, genero: nombreGen })
    //         else
    //             res.render('genero/listLibros', { title: 'Sin libros por ahora', genero: nombreGen })
    //     })

    //     //console.log('res', rows)

    // })
}

exports.formCrear = (req, res) => {
    res.render('genero/crear', { title: 'Crea un genero' })
}

exports.create = async (req, res) => {
    let newGenero = new Genero(req.body.nombre, req.body.descripcion, req.session.user.ses_id);
    let insertId = await newGenero.save();

    res.json({ id: insertId });
}