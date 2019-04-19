'use strict';

var sql = require('./db.js')

// Constructor de A U T O R E S
var Autores = function(autores){
    this.ID = autores.ID;
    this.Nombre = autores.Nombre;
    this.fecnac = autores.fecnac;
    this.created_at = autores.created_at;
    this.update_at = autores.update_at;
}

Autores.createBook = function addAuthor(newAuthor, result){

    sql.query("INSERT INTO Autores set ?", newAuthor, function (err, res) {
            if (err) {
                console.log("Error :", err)
                result(err, null)
            } 
            else 
            {
                console.log(res.insertID)
                result(null, res.insertID)
            }
        })
    }

Autores.getBookByAuthor = function getBook(authorNombre, result){

    sql.query("SELECT * FROM Autores WHERE Nombre = ?", authorNombre, function (err, res) {
            if (err) {
                console.log("Error :", err)
                result(err, null)
            } else {
                result(null, res)
            }
        })
    }

Autores.getAllAuthors = function getAllAuthors(result){

    sql.query("SELECT * FROM Autores", function(err, result){
            if(err){
               console.log("Error: ", err)
               result(err, null)
            } else {
                result(null, res)
            }
        })
    }

Autores.remove = function (ID, result){

    sql.query("DELETE FROM Autores where ID = ", [ID], function(err, res){
        if(err){
            console.log("Error: ", err)
            result(null, res)
        } else {
            result(null, res)
        }
    })
}

module.exports = Autores;