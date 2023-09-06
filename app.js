const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const popupsRouter = require('./routes/popups');
const reviewsRouter = require('./routes/reviews');
const goodsRouter = require('./routes/goods');
const s3Router = require('./routes/s3');

const app = express();

// mongoose setup
mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
})

// cors 처리
app.use(cors({ 
  origin: [                         // 접근 도메인 설정
    "http://localhost:3000", 
    "https://ddage.shop/"
  ],
  credentials: true,                // 요청에 토큰 포함시키도록 허용
  allowedHeaders: "Content-Type"    // 허용할 HTTP 헤더 지정
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/popups', popupsRouter);
app.use('/reviews', reviewsRouter);
app.use('/goods', goodsRouter);
app.use('/s3',s3Router);

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
