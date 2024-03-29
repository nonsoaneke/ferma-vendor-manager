var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const expHbs = require('express-handlebars');
const Keycloak = require('keycloak-connect');
const mongoose = require('mongoose');

// const devMongo = 'mongodb://127.0.0.1:27017/shopping';

// mongoose.connect(devMongo, { useNewUrlParser: true });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const vendorRoutes = require('./routes/vendor');
const adminRoutes = require('./routes/admin');

var app = express();

// view engine setup
// view engine setup
app.engine('hbs', expHbs({
  defaultLayout:"layout",
  extname:"hbs",
  layoutsDir:"views/layouts",
  partialDir:"views/partials"
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(session({
  secret:"my-app-secret",
  resave: false,
  saveUninitialized: false,
  store: memoryStore,
  cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(keycloak.middleware({
    logout: "/logout",
    admin: "/"
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes);

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
