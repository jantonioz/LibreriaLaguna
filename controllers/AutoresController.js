'use strict';

var Autores = require('.../models/autores')

exports.list_all_authors = function(res, res){
    Autores.getAllAuthors(function(err, autores){
            console.log("Autores Controller")
            if(err){
                res.send(err)
            }
            console.log('res', autores)

            res.render('autor/listView',{autores: autor} )
    })
}

