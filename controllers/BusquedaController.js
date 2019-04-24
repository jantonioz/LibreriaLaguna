'use strict';

var Libro = require('../models/libro');
var Editorial = require('../models/editorial');
var Genero = require('../models/genero');
var Autor = require('../models/autor');

exports.find = (req, res) => {
    var search = req.body.search;



    res.json(req.body);
}