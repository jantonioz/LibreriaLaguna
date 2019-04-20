'use strict';

var sql = require('./db.js')

class ImagenLibro {
    constructor(libro_id, data, img_filename) {
        this.libro_id = libro_id;
        this.data = data;
        this.img_filename = img_filename;
    }
}

ImagenLibro.create = (imagenLibro, result) => {
    console.log(imagenLibro)
    sql.query("INSERT INTO imagen_libro(data, img_filename, libro_id) VALUES(?, ?, ?)",
        [imagenLibro.data, imagenLibro.img_filename, imagenLibro.libro_id],
        (err, res) => {
            if (err) {
                console.log("error: ", err)
                result(err, null)
            }

            result(null, res)
        })
}


ImagenLibro.getImagesOfLibroID = (libro_id, result) => {
    sql.query("SELECT * FROM imagen_libro WHERE libro_id = ?", libro_id, (err, res) => {
        if (err) {
            console.log("error:", err)
            result(err, null)
        }
        result(null, res)
    })
}


module.exports = ImagenLibro