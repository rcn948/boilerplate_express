var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
const hbs = require('express-hbs');
const helper = require('hbshelper')(hbs);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + "/views/layouts/partials",
  defaultLayout: __dirname + "/views/layouts/layout",
  layoutsDir: __dirname + "/views/layouts",
  beautify: true,
  // handlebars: allowInsecurePrototypeAccess(hbs)
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
    {
      secret: process.env.secret,
      resave: true,
      cookie: { secure: false },
      saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use("*", function (req, res, next) {
  console.log(req.url);
  next();
})

const routes = glob.sync(__dirname + '/routes/*.js');
routes.forEach(function (route) {
  var extension = path.extname(route);
  var file = path.basename(route,extension);
  var router = require('./routes/'+file);

  if(file == 'index'){
    app.use('/' , router)
  }else{
    app.use('/'+file , router)
  }
});

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
