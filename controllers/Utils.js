const bcrypt = require('bcrypt');
const saltRounds = 8;


exports.getNombreUsuario = (req) => {
    console.log("gNU: ", req.session);
    if (req.session && req.session.user) {
        console.log("NOMBRE: ", req.session.user.name);
        return req.session.user.name;
    }
    console.log("NOT FOUND");
    return;
}

exports.isAdmin = (req) =>  {
    let admin = null;
    if (req.session.user)
        admin = req.session.user.isAdmin;
    return admin == 1;
}

exports.getSid = (req) => {
    if (req.session && req.session.user) {
        return req.session.ses_id;
    }
    return -1;
}

exports.crypt = (string) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(string, saltRounds, (err, encrypted) => {
            if (!err) {
                resolve(encrypted);
            } else {
                reject(err);
            }
        })
    });
}

exports.compare = (encString, string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, encString, (err, same) => {
            if (!err) {
                resolve(same);
            } else {
                reject(err);
            }
        })
    });
}