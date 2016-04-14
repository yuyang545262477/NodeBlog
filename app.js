var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//导入数据库配置
var settings = require('./settings');
//导入页面通知模块
var flash = require('connect-flash');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(flash());

//设置中间件
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db, //cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        url: 'mongodb://localhost/nodeblog'
    })
}));


//设置路由.
routes(app);
module.exports = app;
