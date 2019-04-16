var express = require('express');
var router = express.Router();

var mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'libreria',
})

/* GET home page. */
router.get('/', function (req, res, next) {

  var lista = []
  con.connect(function (err) {
    if (err) console.log("ERROR")

    con.query('select * from employees', function (err2, result) {
      if (err2) console.log("ERROR");
      lista = result
      console.log(result[0].first_name)
      res.render('index', { title: 'ASDASD', listado: lista });
    })
  })
  console.log("HECHO")
});

module.exports = router;
