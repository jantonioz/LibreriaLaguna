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

exports.getLibrosBy = (req, res) => {
    Genero.booksBy(req.params.gen_id, (err, rows) => {
        if (err) {
            res.send(err)
        }

        Genero.findById(req.params.gen_id, (err, nombreGen) => {
            console.log(nombreGen[0].genero);
            nombreGen = nombreGen[0].genero;
            if (rows.length > 0)
                res.render('genero/listLibros', { title: rows[0].genero, libros: rows, genero: nombreGen })
            else
                res.render('genero/listLibros', { title: 'Sin libros por ahora', genero: nombreGen })
        })

        //console.log('res', rows)

    })
}

exports.formCrear = (req, res) => {
    res.render('genero/crear', { title: 'Crea un genero' })
}

exports.create = (req, result) => {
    let newGenero = new Genero(req.body.nombre);
    Genero.create(newGenero, (err, res) => {
        if (err) {
            result.send("ERROR");
        }
        else {
            result.json(res)
        }
    })
}