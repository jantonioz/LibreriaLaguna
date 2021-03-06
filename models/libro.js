'use strict';

var sql = require('./db.js')
var AutorLibro = require('./autor_libro.js');
const imagenLibro = require('./imagen_libro');



const selectors = 'lib.lib_id, lib.titulo, lib.orig_titulo, lib.isbn,lib.paginas, lib.fecha_pub, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id, lib.editorial_id, ed.ed_nombre AS editorial ';
const imgSelectors = ', img.img_path AS path,' +
    ' img.img_filename AS filename  ';

const normalInfoHeaders =
    'lib.lib_id, lib.titulo, lib.orig_titulo, lib.isbn,lib.paginas, lib.fecha_pub, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id, lib.editorial_id, ed.ed_nombre AS editorial ';

const completeInfo = ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' LEFT JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' LEFT JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' LEFT JOIN editoriales AS ed ON (ed.ed_id = lib.editorial_id) ';

const imageJOIN = ' LEFT JOIN imagen_libro AS img ON (lib.lib_id = img.libro_id) ';

const fullINFO = ' lib.lib_id, lib.titulo, lib.isbn,lib.paginas, lib.fecha_pub, ' +
    'lib.descripcion, gen.gen_nombre AS genero, aut.aut_nombre AS autor, img.img_path AS path,' +
    ' img.img_filename AS filename,  ' +
    'aut.aut_id AS autor_id, gen.gen_id AS gen_id ' +
    ' FROM libros AS lib' +
    ' INNER JOIN generos AS gen ON (lib.genero_id = gen.gen_id) ' +
    ' INNER JOIN autor_libro AS al ON (al.libro_id = lib.lib_id) ' +
    ' INNER JOIN autores AS aut ON (aut.aut_id = al.autor_id) ' +
    ' INNER JOIN imagen_libro AS img ON (lib.lib_id = img.libro_id) ';
exports.fullInfo = fullINFO;

const insert = "INSERT INTO libros" +
    "(titulo, orig_titulo, isbn, paginas, fecha_pub," +
    " descripcion, editorial_id, genero_id, ses_id, created_at, updated_at)" +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

const fields = {
    titulo: 'titulo', tituloOrig: 'orig_titulo', isbn: 'isbn', paginas: 'paginas',
    descripcion: 'descripcion', publicacion: 'fecha_pub', editorial_id: 'editorial_id',
    genero_id: 'genero_id', ses_id: 'ses_id'
};

const assignTo = ' = ? ';

const SELECT_ONLY_ID = 'SELECT * FROM libros';


const update = 'UPDATE libros SET ' +
    fields.titulo + assignTo + ', ' +
    fields.tituloOrig + assignTo + ', ' +
    fields.isbn + assignTo + ', ' +
    fields.paginas + assignTo + ', ' +
    fields.descripcion + assignTo + ', ' +
    fields.publicacion + assignTo + ', ' +
    fields.genero_id + assignTo + ', ' +
    fields.editorial_id + assignTo +
    'updated_at = NOW() ' +
    'WHERE lib_id' + assignTo;

class Libro {
    constructor(titulo, tituloO, isbn, paginas, descripcion, publicacion, ses_id, gen_id, ed_id, lib_id = 0) {
        this.id = lib_id;
        this.titulo = titulo;
        this.tituloOrig = tituloO;
        this.isbn = isbn;
        this.paginas = paginas;
        this.descripcion = descripcion;
        this.publicacion = publicacion;
        this.editorial_id = ed_id;
        this.genero_id = gen_id;
        this.lib_id = lib_id;
        this.ses_id = ses_id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(insert,
                [this.titulo, this.tituloOrig, this.isbn, this.paginas,
                this.publicacion, this.descripcion, this.editorial_id,
                this.genero_id, this.ses_id],
                (err, res) => {
                    if (err) {
                        console.log("error :", err);
                        resolve(-1);
                    } else {
                        console.log(res.insertId);
                        this.id = res.insertId;
                        resolve(res.insertId);
                    }
                });
        });

    }


    update() {
        return new Promise((resolve, reject) => {
            sql.query(update,
                [this.titulo, this.tituloOrig, this.isbn, this.paginas,
                this.descripcion, this.publicacion, this.genero_id,
                this.editorial_id, this.id],
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(res);
                        resolve(res);
                    }
                });
        });
    }

    getAutor() {
        return new Promise((resolve, reject) => {
            sql.query('SELECT autor_id FROM autor_libro WHERE libro_id = ?', this.id,
                (err, res) => {
                    if (!err) {
                        resolve(res[0]);
                    } else {
                        reject(err);
                    }
                });
        });
    }

    attachAutor() {
        // return new Promise((resolve, reject) => {
        //     sql.query
        // })
    }
}


// Libro.createLibro = function createUser(newLibro, result) {

//     sql.query(insert,
//         [newLibro.titulo, newLibro.tituloOrig, newLibro.isbn, newLibro.paginas,
//         newLibro.descripcion_fisica, newLibro.descripcion, newLibro.editorial_id,
//         newLibro.genero_id],
//         (err, res) => {
//             if (err) {
//                 console.log("error :", err)
//                 result(err, null)
//             } else {
//                 console.log(res.insertId)
//                 result(null, res.insertId)
//             }
//         })
// }

Libro.getLibroById = function createUser(libroId) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT " + selectors + completeInfo + " WHERE lib.lib_id = ? ", libroId, function (err, res) {
            if (!err) {
                console.log("ok :", res)
                resolve(res);
            } else {
                console.log(err);
                resolve(null);
            }
        })
    });

}

Libro.getAllLibros = async () => {
    return new Promise((resolve, reject) => {
        // NO FUNCA EL AWAIT DENTRO DEL QUERY AAAAAAAAAAAAAAA
        sql.query("SELECT " + normalInfoHeaders + completeInfo, async (err, res) => {
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

Libro.getAllLibrosSimple = () => {
    return new Promise((resolve, reject) => {
        sql.query(SELECT_ONLY_ID, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                resolve(null);
            }
        });
    });
}

Libro.find = function findLibro(titulo, result) {
    sql.query("SELECT " + selectors + imgSelectors + completeInfo + imageJOIN + " WHERE titulo LIKE ? OR " + fields.tituloOrig + " LIKE ?", [titulo, titulo], function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(null, err)
        } else {
            result(null, res)
        }
    })
}

Libro.updateTitleById = function update(id, libro, result) {
    sql.query("UPDATE libros SET Titulo = ? WHERE id = ?", [libro.Titulo, id],
        function (err, res) {
            if (err) {
                console.log("error: ", err)
                result(null, err)
            } else {
                result(null, res)
            }
        })
}

Libro.remove = function (id, result) {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM libros WHERE lib_id = ?", id, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });

}

Libro.getAllFormatted = (result) => {

    sql.query("SELECT " + selectors + imgSelectors + completeInfo + imageJOIN, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            for (let i = 0; i < res.length; i++) {
                if (typeof res[i].imgdata !== 'undefined' && res[i].imgdata != null) {
                    let tempbin = res[i].imgdata;
                    res[i].imgdata = Buffer.from(tempbin, 'binary').toString('base64');;
                }
            }
            result(null, res);
        }
    });
}

module.exports = Libro;