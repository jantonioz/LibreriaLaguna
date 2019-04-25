'use strict';

var sql = require('./db.js')

const fields = {calle: 'dir_calle', numero: 'dir_num', colonia: 'dir_colonia', 
                ciudad: 'dir_cd', pais: 'dir_pais'};

const assign = ' = ?';
const comma  = ', ';

const INSERT = 'INSERT INTO direcciones(' + fields.calle + comma + 
    fields.numero + comma + fields.colonia + comma + fields.ciudad + comma +
    fields.pais + comma +  'created_at) VALUES (?, ?, ?, ?, ?, NOW())';


class Direccion{
    constructor(calle, numero, colonia, ciudad, pais) {
        this.calle = calle;
        this.numero = numero;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.pais = pais;
    }

    save(result) {
        sql.query(INSERT, [this.calle, this.numero, this.colonia, this.ciudad, this.pais], 
            (err, res) => {
                if (err){
                    console.log("ERROR: ", err);
                    result(err, null);
                }
                else {
                    result(null, res);
                }
            }
        );
    }
}

module.exports = Direccion;