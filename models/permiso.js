const sql = require('./db');

const INSERT = 'INSERT INTO permisos (perm_permisos, rol_id, ses_id, created_at, updated_at) ' +
    'VALUES (?, ?, ?, NOW(), NOW())';

const SELECT_ALL = 'SELECT * FROM permisos';

class Permiso {
    constructor(permisos, rol_id = 0, ses_id = 0, id = 0) {
        this.permisos = permisos;
        this.rol_id = rol_id;
        this.ses_id = ses_id;
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            sql.query(SELECT_ALL, [this.permisos, this.rol_id, this.ses_id],
                (err, res) => {
                    if (!err) {
                        resolve(res);
                    } else {
                        reject(err);
                    }
                });
        });
    }
}

