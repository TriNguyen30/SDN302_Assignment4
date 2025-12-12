var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override');
// const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
require('dotenv').config();



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
const questionRouter = require('./routes/question');
const authRouter = require('./routes/auth');
var app = express();
const connect = mongoose.connect(process.env.MONGO_URI)
connect.then(() => {
  console.log('Connected correctly to server');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);
app.use('/auth', authRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const status = err.status || 500;
  // If the client expects JSON (API call / Postman), send JSON
  const acceptsJSON = req.xhr || (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1);
  if (acceptsJSON) {
    return res.status(status).json({ message: err.message || 'An error occurred' });
  }

  // render the error page for browser requests
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status);
  res.render('error');
});

module.exports = app;
