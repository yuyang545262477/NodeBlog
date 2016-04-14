/*
 * 这里的型参,假设就是express的实例,事实上,也是.
 * */
var crypto = require('crypto'),
    User = require('../models/user.js');

function routes(app) {


    //首页
    app.get('/', function (req, res) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });


    //注册页面
    app.get('/reg', checkUnLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册页面',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
    app.post('/reg', checkUnLogin);
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
                // req.flash('error', err);
                console.log('获取信息失败.');
                return res.redirect('/');
            }
            if (user) {
                // req.flash('error', '用户已存在!');
                console.log('用户已经存在');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    // req.flash('error', err);
                    console.log("增加用户失败");
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = newUser;//用户信息存入 session
                console.log("增加用户成功");
                res.redirect('/');//注册成功后返回主页
            });
        });
    });


    //文章发表页面
    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        res.render('post', {title: '文章发表页面'})
    });
    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {

    });
    //登录页面
    app.get('/login', checkUnLogin);
    app.get('/login', function (req, res) {
        res.render('login',
            {
                title: '登录页面',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
    });

    app.post('/login', checkUnLogin);
    app.post('/login', function (req, res) {
        //    首先对密码进行md5处理
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //  对前端传入的值,进行审核
        User.get(req.body.name, function (err, user) {
            //首先判断,用户是否存在
            if (!user) {
                req.flash('error', '用户不存在');
                res.redirect('/login');
            }
            //    其次判断,密码是否正确
            if (password != user.password) {
                req.flash('error', '密码错误');
                res.redirect('/login');
            }
            //    用户存在又密码正确;将session换成 user 
            req.session.user = user;
            req.flash('success', "登录成功");
            res.redirect('/');

        })
    });
//    登出页面
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    });


//  通过两个函数,来判断状态.
    function checkLogin(reg, res, next) {
        if (!reg.session.user) {
            reg.flash('error', "当前用户未登录");
            res.redirect('/');
        }
        next();
    }

    function checkUnLogin(reg, res, next) {
        if (reg.session.user) {
            reg.flash('error', "当前用户已经登录");
            res.redirect('/');
        }
        next();
    }
}


module.exports = routes;