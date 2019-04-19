'use strict';

var sql = require('./db.js')

// Constructor de A U T O R - L I B R O
var Autor_Libro = function(autor_libro){
    this.autor_ID = autor_libro.autor_ID;
    this.libro_ID = autor_libro.libro_ID;
    this.created_at = autor_libro.created_at;
    this.updated_at = autor_libro.updated_at;
}