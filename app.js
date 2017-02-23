var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var index = require('./routes/index');

var app = express();

//  使用pug作为模板引擎
app.set('view engine', 'pug');

//  设置链接端口
app.set('port', process.env.PORT || 3000);

//  静态资源存放在/public目录下
app.use(express.static(__dirname + '/public'));

//  使用中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//  配置session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

//  配置路由
app.use('/', index);

//  no found page
app.use(function(req, res){
    res.render('notfound');
});

//  error page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.render('error');
});

//  服务器启动
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
         app.get('port') + '; press Ctrl-C to terminate.' );
});
