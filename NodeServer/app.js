var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(function (req, res, next) {
    var origin = req.headers.origin
    //console.log("origin: " + origin);
    if (typeof origin != 'undefined'){
        // Website you wish to allow to connect
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.setHeader('Access-Control-Allow-Origin', origin);
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        // Pass to next layer of middleware
    }
    if(req.method == "OPTIONS") {
        res.status(200);
        res.send('')
    } else {
        next();
    }
});

// Data Access Layer
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
// /Data Access Layer


// Models
require('./models/secretMessage')(mongoose);
// /Models


function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var secretMessage = require('./routes/secretMessage')(mongoose, app, handleError);

app.use('/', routes);
app.use('/secretMessage', secretMessage);



// error handlers


//Middelware voor error handeling vanuit de routes
app.use(function(err, req, res, next) {
  if(!err){ next(); }
  res.status = 403;
  var msg = {
      msg: "Oops somethign went wrong :(",
      err: err,
  }
  res.json(msg);
});

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
    res.json( { message: err.message, error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json( { message: err.message, error: err });
});

module.exports = app;
