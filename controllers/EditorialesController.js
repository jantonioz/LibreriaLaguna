'use strict';

var Editorial = require('../models/editorial');


exports.list_all_editoriales = (req, res) => {
    Editorial.find(null, (err, rows) => {
        if (err) {
            res.send(err)
        }
        console.log('res', rows)
        res.render('editorial/listView', { title: 'Editoriales', editoriales: rows })
    })
}

exports.getLibrosBy = (req, res) => {
    Editorial.booksBy(req.params.ed_id, (err, rows) => {
        if (err) {
            res.send(err)
        } else {
            Editorial.findById(req.params.ed_id, (err, nombreEd) => {
                console.log(nombreEd);

                nombreEd = nombreEd[0].ed_nombre;
                if (rows.length > 0)
                    res.render('editorial/listLibros', { title: rows[0].editorial, libros: rows, editorial: nombreEd })
                else
                    res.render('editorial/listLibros', { title: 'Sin libros por ahora', editorial: nombreEd })
            })
        }
    })
}

exports.formCrear = (req, res) => {
    res.render('genero/crear', { title: 'Crea un genero' })
}

exports.create = (req, result) => {
    let newGenero = new Editorial(req.body.nombre);
    Editorial.create(newGenero, (err, res) => {
        if (err) {
            result.send("ERROR");
        }
        else {
            result.json(res)
        }
    })
}