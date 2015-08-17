var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/*
 * START Set Action check authen for request
 */
var PersonAccessService = require("./appcommon/services/AccessService");
app.all("/demo/Require*", PersonAccessService.checkAccessToken);
/*
 * END Set Action check authen for request
 */

/*
 * START set config mapping url
 */
//person controller for demo
var personCtrl = require("./appcommon/controllers/PersonCtrl");
app.use('/demo/person', personCtrl);

//upload file controller for demo
var uploadFileCtrl = require("./appcommon/controllers/UploadFileCtrl");
app.use('/demo/upload', uploadFileCtrl);

//user controller for api
var userCtrl = require("./appcommon/controllers/UserCtrl");
app.use('/api/user', userCtrl);

/*
 * END set config mapping url
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;