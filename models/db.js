'use strict';

var mysql = require('mysql');

// Coneccion a la bd local
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_libreria',
})

connection.connect(function(err){
    if (err) throw err
})

module.exports = connection