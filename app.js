var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var paginate = require('express-paginate');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// RUTAS
var appRouter = require('./routes/appRoutes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// SOPORTAR IMAGENES EN POST FORMS
app.use(fileUpload());

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

app.use(paginate.middleware(5, 50));


// IMPLEMENTAR TODO EL SISTEMA DE RUTAS
app.use('/', appRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
