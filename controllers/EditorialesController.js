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
    Editorial.booksBy(req.params.id, (err, rows) => {
        if (err) {
            res.send(err)
        } else {
            Editorial.findById(req.params.id, (err, nombreEd) => {
                console.log(nombreEd);

                nombreEd = nombreEd[0].ed_nombre;

                for (let i = 0; i < rows.length; i++) {
                    if (typeof rows[i].imgdata !== 'undefined' && rows[i].imgdata != null) {
                        console.log(rows[i].imgdata)
                        let tempbin = rows[i].imgdata;
                        let data64 = Buffer.from(tempbin, 'binary').toString('base64');
                        rows[i].imgdata = data64;
                        console.log(rows[i].imgdata);
                    }
                }


                if (rows.length > 0)
                    res.render('editorial/listLibros', { title: rows[0].editorial, libros: rows, editorial: nombreEd })
                else
                    res.render('editorial/listLibros', { title: 'Sin libros por ahora', editorial: nombreEd })
            })
        }
    })
}

exports.formCrear = (req, res) => {
    res.render('editorial/crear', { title: 'Registra una editorial', mensaje: 'Registra una editorial' })
}

exports.create = async (req, result) => {

    var nuevaEditorial = new Editorial(req.body.nombre, req.body.correo, req.session.user.ses_id);

    let insertId = await nuevaEditorial.save();

    res.send("OK " + insertId);
}

exports.formEditar = (req, result) => {
    Editorial.findById(req.params.id, (err, res) => {
        if (err)
            result.send('error');

        let mEditorial = new Editorial(res[0].ed_nombre, res[0].ed_correo, res[0].ed_id);
        result.render('editorial/editar', { title: 'Editar editorial', mensaje: 'Editar editorial', editorial: mEditorial });
    })
}

exports.editar = (req, result) => {
    let mEditorial = new Editorial(req.body.nombre, req.body.correo, req.body.id);

    mEditorial.update((err, res) => {
        if (err)
            result.send("ERROR");
        result.redirect('/editoriales');
    })
}