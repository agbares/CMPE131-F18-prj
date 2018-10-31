var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var indexRouter = require('./routes/index');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();
var mongoose = require('mongoose');
var dbConstants = require('./db_config');

const dbURI = `mongodb+srv://${dbConstants.DB_USER}:${dbConstants.DB_PASSWORD}@${dbConstants.DB_HOST}/${dbConstants.DB_NAME}`;
mongoose.connect(dbURI);

//Test code here for models
var accounts = require('./models/account');

var account = new accounts({
  user_ID: '5bd273e7e203fb570415ed6d',
  type: 'Checking',
  balance: 20,
  minimum_due: null,
  limit: null,
  payment_date: null
});

// accounts.find({user_ID: '5bd273e7e203fb570415ed6d', type: 'Checking'}, function(err, res){
//   if(err){
//     console.log(err);
//   }
//   console.log(res);
// })
// account.save(function (err, accountsNew) {
//   if (err) return console.error(err);
//   console.log(accountsNew)
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'CMPE131-Secret'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', indexRouter);

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
