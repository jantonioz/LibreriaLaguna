exports.getNombreUsuario = (req) => {
    console.log("gNU: ", req.session);
    if (req.session && req.session.user) {
        console.log("NOMBRE: ", req.session.user.name);
        return req.session.user.name;
    }
    console.log("NOT FOUND");
    return;
}