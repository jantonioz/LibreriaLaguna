'use strict';

var Libro = require('../models/libro')

exports.list_all_libros = function(req, res){
    Libro.getAllLibros(function(err, libro){
        console.log("libros controller")
        if (err){
            res.send(err)
            
        }
        console.log('res', libro)
        res.send(libro)
    })
}

exports.create_a_libro = function(req, res){
    var new_libro = new Libro(req.body)

    // SOPORTA ERROR NULO
    if (!new_libro || !new_libro.Titulo){
        res.status(400).send({error:true, message: "Inserte un titulo"})
    }else{
        Libro.createLibro(libro, function(err, libro){
            if (err)
                res.send(err)
            res.json(libro)
        })
    }
}


exports.get_a_libro = function(req, res){
    Libro.getLibroById(req.params.libroId, function(err, libro){
        if (err)
            res.send(err)
        res.json(libro)
    })
}

exports.update_a_libro = function(req, res){
    Libro.updateTitleById(req.params.libroId, new Libro(req.body), function(err, libro){
        if (err)
            res.send(err)
        res.json(libro)
    })
}

exports.delete_a_libro = function(req, res){
    Libro.remove(req.params.libroId, function(err, libro){
        if (err)
            res.send(err)
        res.json(libro)
    })
}