/*
 * 这里的型参,假设就是express的实例,事实上,也是.
 * */
var crypto = require('crypto'),
    User = require('../models/user.js');

function routes(app) {
    //首页
    app.get('/', function (req, res) {
        res.render('index', {title: '主页'});
    });
    //注册页面
    app.get('/reg', function (req, res) {
        res.render('reg', {title: '注册页面'})
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回注册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password_md5 = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password_md5,
            email: req.body.email
        });
        //检查用户名是否已经存在 
        User.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = newUser;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });
    });
    //文章发表页面
    app.get('/post', function (req, res) {
        res.render('post', {title: '文章发表页面'})
    });
    app.post('/post', function (req, res) {

    });
    //登录页面
    app.get('/login', function (req, res) {
        res.render('login', {title: '登录页面'})
    });
    app.post('login', function (req, res) {

    });
//    登出页面
    app.get('/logout', function (req, res) {

    });

}

module.exports = routes;