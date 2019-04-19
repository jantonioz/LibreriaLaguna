'use strict';

var sql = require('./db.js')

// Constructor de C O M P R A S
var Compras = function(compras){
    this.ID = compras.ID;
    this.Unidades_de_Producto = compras.Unidades_de_Producto;
    this.Estampa_Tiempo = compras.Estampa_Tiempo;
    this.Verificacion_de_Pago = compras.Verificacion_de_Pago;
    this.Forma_de_Pago = compras.Forma_de_Pago;
    this.Estado_de_Compra = compras.Estado_de_Compra;
    this.Usuario_ID = compras.Usuario_ID;
    this.Ejemplar_ID = compras.Ejemplar_ID;
    this.Direccion_ID = compras.Direccion_ID;
    this.Empleado_ID = compras.Empleado_ID;
    this.Created_at = compras.Created_at;
    this.Updated_at = compras.Updated_at;
}