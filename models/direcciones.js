'use strict';

var sql = require('./db.js')

var Direcciones = function(direccion){
    this.ID = direccion.ID;
    this.Calle = direccion.Calle;
    this.Numero = direccion.Numero;
    this.Colonia = direccion.Colonia;
    this.Ciudad = direccion.Ciudad;
    this.Pais = direccion.Pais;
    
}