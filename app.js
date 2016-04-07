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
var fileCtrl = require("./appcommon/controllers/FileCtrl");
app.use('/api/file', fileCtrl);

//user controller for api
var userCtrl = require("./appcommon/controllers/UserCtrl");
app.use('/api/user', userCtrl);

//user contact controller for api
var userContactCtrl = require("./appcommon/controllers/UserContactCtrl");
app.use('/api/userContact', userContactCtrl);

//location controller for api
var locationCtrl = require("./appcommon/controllers/LocationCtrl");
app.use('/api/location', locationCtrl);

//shoptype controller for api
var shopTypeCtrl = require("./appcommon/controllers/ShopTypeCtrl");
app.use('/api/shop-type', shopTypeCtrl);

//shop controller for api
var shopCtrl = require("./appcommon/controllers/ShopCtrl");
app.use('/api/shop', shopCtrl);

//category controller for api
var categoryCtrl = require("./appcommon/controllers/CategoryCtrl");
app.use('/api/category', categoryCtrl);

//product controller for api
var productCtrl = require("./appcommon/controllers/ProductCtrl");
app.use('/api/product', productCtrl);

//shop address controller for api
var shopAddressCtrl = require("./appcommon/controllers/ShopAddressCtrl");
app.use('/api/shop-address', shopAddressCtrl);

//user favorite controller for api
var userFavoriteCtrl = require("./appcommon/controllers/UserFavoriteCtrl");
app.use('/api/user-favorite', userFavoriteCtrl);

//comment controller for api
var productCommentCtrl = require("./appcommon/controllers/ProductCommentCtrl");
app.use('/api/product-comment', productCommentCtrl);

//comment notification controller for api
var commentProductNotificationCtrl = require("./appcommon/controllers/CommentProductNotificationCtrl");
app.use('/api/comment-product-notification', commentProductNotificationCtrl);

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
