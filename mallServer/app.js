var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require("express-session")
var MongoStore = require("connect-mongo")(session)
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({limit: '3mb', extended: true}));
// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall');
mongoose.connection.on('connected', function(){
    console.log("MongoDB connected success");
})
mongoose.connection.on('error', function(){
    console.log("MongoDB connected error");
})
mongoose.connection.on('disconnected', function(){
    console.log("MongoDB connected disconnected");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 设置html文件类型渲染
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));

// 验证使用express-session的使用
/*
app.use(cookieParser());
app.use(session({
  secret:'123456',
  name:'testapp',
  cookie:{maxAge:80000},
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url:'mongodb://127.0.0.1:27017/mall'
    // host:'localhost',
    // port:27017,
    // db:'mall'
  })
}))

app.get('/awesome', function(req,res){
  if(req.session.lastPage) {
    console.log('Last page was: ' + req.session.lastPage + "."); 
  }
  req.session.lastPage = '/awesome';
  res.send("You're Awesome. And the session expired time is: " + req.session.cookie.maxAge);
})
app.get('/radical', function(req, res){
  console.log("req.session.lastPage",req.session.lastPage);
  if(req.session.lastPage){
    console.log('Last page was: ' + req.session.lastPage + ".");
  }
  req.session.lastPage = '/radical';
  res.send('What a radical visit! And the session expired time is: ' + req.session.cookie.maxAge);
})
app.get('/tubular', function(req, res){
  if (req.session.lastPage){
    console.log("Last page was: " + req.session.lastPage + ".");
  }
  req.session.lastPage = '/tubular';
  res.send('Are you a suffer? And the session expired time is: ' + req.session.cookie.maxAge);
})
*/

// 创建一个全局的登录拦截
app.use(function(req, res, next){
  if(req.cookies.userId){
    next();
  }else{
    // cookies.userId不存在，未登录
    if(req.originalUrl=="/users/login" || req.originalUrl=="/users/logout" || req.path =="/goods" || req.originalUrl=="/users/register"){
      next();
    }else{
      res.json({
        status:"10001",
        msg:"未登录，无法执行操作",
        result:""
      })
    }
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);


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
