'use strict';

var sql = require('./db');
const imagenLibro = require('./imagen_libro');



const INSERT = 'INSERT INTO Generos(gen_nombre, gen_descripcion, ses_id, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW())';
const SELECT_ALL = 'SELECT * FROM Generos LIMIT 5';
const filterByName = 'WHERE gen_nombre like ?';
const filterById = 'WHERE gen_id = ?';
const UPDATE = 'UPDATE Generos SET gen_nombre = ?, gen_descripcion = ? WHERE gen_id = ?';

const fullINFO = 'SELECT lib.lib_id, lib.titulo, lib.isbn, lib.paginas, lib.fecha_pub, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, img.img_path AS path,' +
    ' img.img_filename AS filename,  ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id ' +
    ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' INNER JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN imagen_libro AS img ON (lib.lib_id = img.libro_id) ';

const normalInfoHeaders =
    'lib.lib_id, lib.titulo, lib.orig_titulo, lib.isbn,lib.paginas, lib.fecha_pub, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id, lib.editorial_id, ed.ed_nombre AS editorial ';

const completeInfo = ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' LEFT JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' LEFT JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN editoriales AS ed ON (ed.ed_id = lib.editorial_id) ';

const WHERE_GENID = 'WHERE gen.gen_id = ?';

const libroBy = fullINFO + ' WHERE gen.gen_id =  ?';

class Genero {
    constructor(nombre, descripcion, ses_id) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.ses_id = ses_id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(INSERT, [this.nombre, this.descripcion, this.ses_id], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            sql.query(UPDATE, [this.nombre, this.descripcion], (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }
}

Genero.find = (result) => {
    sql.query(SELECT_ALL, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

Genero.findByNombre = (nombre, result) => {
    sql.query(SELECT_ALL + filterByName, nombre, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

Genero.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT gen_nombre AS genero FROM generos WHERE gen_id = ?', id, (err, res) => {
            if (err) {
                console.log("ERROR: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });

}

Genero.booksBy = (gen_id, result) => {

    return new Promise((resolve, reject) => {
        sql.query("SELECT " + normalInfoHeaders + completeInfo + WHERE_GENID, gen_id, async (err, res) => {
            if (!err) {
                for (var i = 0; i < res.length; i++) {
                    let imagenes = await imagenLibro.getImagesOfLibroID(res[i].lib_id);
                    console.log(imagenes);
                    if (imagenes.length > 0) {
                        res[i].imagenes = imagenes;
                        res[i].imagenes[0].active = 1;
                    }
                }
                resolve(res);
            } else {
                console.log(err);
            }
        })
    });
}

Genero.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(SELECT_ALL, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = Genero