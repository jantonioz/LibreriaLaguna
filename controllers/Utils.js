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