'use strict';

var Libro = require('../models/libro')

exports.list_all_libros = function(req, res){
    Libro.getAllLibros(function(err, libro){
        console.log("libros controller")
        if (err){
            res.send(err)
        }
        console.log('res', libro)
        
        res.render('libro/listView', {libros: libro, activeLibros: 'active'})
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

exports.find_a_libro = function(req, res){
    
    Libro.find(req.body.search, function(err, libros){
        if (err)
            console.log(err)

        console.log(libros)
        res.render('libro/listView', {libros: libros, activeLibros: 'active'})
    })
}

exports.get_a_libro = function(req, res){
    console.log(req.params.libroId)
    Libro.getLibroById(req.params.libroId, function(err, libro){
        if (err)
            res.send(err)

        console.log(libro)
        res.render('libro/singleView', {libro: libro[0]})
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