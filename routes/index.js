var crypto = require('crypto'),
    Post = require('../models/post'),
    User = require('../models/user');


module.exports = function (app) {
    app.get('/', function (req, res) {
        Post.get(null, function (err, docs) {
            if (err) {
                docs = [];
                req.flash('error', '获取文章失败');
            }
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: docs,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
        
    });
    
    
    app.get('/reg', Unlogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: 'reg',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            re_password = req.body.re_password,
            email = req.body.email;
        //    效验密码的一致性
        if (password !== re_password) {
            req.flash('error', '两次密码不一致');
            console.log(password);
            console.log(re_password);
            
            return res.redirect('/reg');
        }
        //    生成密码 md5的值
        var md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        
        var newUser = new User({
            name: name,
            password: password,
            email: email
        });
        
        //    检查用户是否存在
        User.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已经存在');
                return res.redirect('/reg');
            }
            //    如果不能存在 则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功');
                return res.redirect('/');
            });
            
            
        });
        
        
    });
    
    app.get('/login', Unlogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'login',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        //    首先从页面,获取用户名和密码
        var name = req.body.name,
            password = req.body.password;
        //  对密码进行加密处理
        var md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        
        
        User.get(name, function (err, user) {
            if (!user) {
                req.flash('error', '用户名不存在');
                return res.redirect('/');
            }
            if (user.password !== password) {
                req.flash('error', '密码不正确');
                return res.redirect('/login');
            }
            req.flash('success', '登录成功');
            req.session.user = user;
            return res.redirect('/');
        });
        
    });
    
    
    app.get('/post', Logined);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: 'post',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', function (req, res) {
        var name = req.session.user.name,
            title = req.body.title,
            article = req.body.article,
            post = new Post(name, title, article);
        
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功');
            return res.redirect('/');
        })
        
    });
    
    
    app.get('/logout', Logined);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功');
        return res.redirect('/');
    });
    
    function Logined(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录');
            return res.redirect('/');
        }
        next();
    }
    
    function Unlogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('/');
        }
        next();
    }
    
    
};