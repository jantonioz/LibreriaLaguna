// LOTS OF BUGS

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const paginate = require('express-paginate');
const userAgent = require('express-useragent');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const favicon = require('serve-favicon');

const mGeneros = require('./models/genero');
const mEditorial = require('./models/editorial');

var appRouter = require('./routes/appRoutes');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// favicon
app.set(favicon(__dirname + '/public/favicon/favicon.ico'));

app.use(logger('dev'));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// USER AGENT
app.use(userAgent.express());

// PAGINACION
app.use(paginate.middleware(5, 50));

// SESSIONES
app.use(session({
  key: 'sid',
  secret: 'c3VwZXJzZWNyZXRwYXNzd29yZA==',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 2
  }
}));

app.use((req, res, next) => {
  if (req.cookies.sid && !req.session.user) {
    res.clearCookie('sid');
  }
  next();
});

app.use(fileUpload());

function rolIs(req, rolnameToCheck) {
  if (!req.session)
    return false;
  if (!req.session.user)
    return false;
  return (String.prototype.toLowerCase.apply(req.session.user.nombreRol) == rolnameToCheck);
}

var navbarMiddleware = async (req, res, next) => {
  let generos = await mGeneros.getAll().catch((reason) => {
    console.log("ERROR CARGANDO GENEROS", reason);
  });

  let editoriales = await mEditorial.getAll();

  console.log("CARGANDO GENEROS");
  if (generos != null && generos.length > 0) {
    res.locals.generos = generos;
  }
  if (editoriales != null && editoriales.length > 0) {
    res.locals.editoriales = editoriales;
  }

  if (rolIs(req, 'bookadmin') || rolIs(req, 'sysadmin') || rolIs(req, 'proveedor')) {
    console.log("isAdmin set");
    res.locals.isAdmin = 1;
  }

  if (rolIs(req, 'bookadmin')) {
    res.locals.bookadmin = 1;
  }
  if (rolIs(req, 'stockadmin')) {
    res.locals.stockadmin = 1;
  }
  if (rolIs(req, 'sysadmin')) {
    res.locals.sysadmin = 1;
  }

  next();
}

app.use('/', navbarMiddleware);

// IMPLEMENTAR TODO EL SISTEMA DE RUTAS
app.use('/', appRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
