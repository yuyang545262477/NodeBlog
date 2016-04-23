var crypto = require('crypto');

var User = require('../models/users');


function routes(app) {
    /*
     * 1. index
     * 2.regist
     * 3.login
     * 4.post
     * 5.logout
     * */


    //1.    index
    app.get('/', function (req, res) {
        res.render('index',
            {
                title: '主页',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            }
        );
    });

    //2.    regist
    app.get('/reg', checkUnlogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        //step one:    get datas from font-end
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body.password_repeat,
            email = req.body.email;
        //step two:    judge password
        if (password != password_re) {
            req.flash('error', 'password is not equal password_repeat');
            return res.redirect('/reg');
        }
        //step three:    create md5 of password
        var md5 = crypto.createHash('md5'),
            password_md5 = md5.update(req.body.password).digest('hex');
        //step four:    initial User
        var newUser = new User({
            name: name,
            password: password_md5,
            email: email
        });
        //    step five:    check newUser name;
        newUser.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            if (user) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            //  step six:    add newUser
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success', 'succesing add');
                return res.redirect('/');
            });
        });

    });

    //3.    login
    app.get('/login', checkUnlogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        /*
         * 1.get dataes form font-end
         * 1.1  password to md5
         * 2.open mongodb
         * 3.check password
         * 4.check users
         * 5.change session.user
         * 6.redirect('/')
         * */
        //    get dataes form font-end
        var name = req.body.name,
            password = req.body.password;
        //     md5 password
        var md5 = crypto.createHash('md5'),
            password_md5 = md5.update(password).digest('hex');
        //    open mongodb
        var newLogin = new User({
            name: name,
            password: password_md5
        });
        newLogin.get(name, function (err, user) {
            if (err && !user) {
                req.flash('error', error);
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', 'login success');
            return res.redirect('/');

        })


    });

    //4.    post
    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        res.render('post',
            {
                title: 'post',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            }
        );
    });
    app.post('/post', function (req, res) {
        res.render('post', {title: 'post'});
    });

    //5.    logout
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        /*
         * 1.null req.session.user
         * 2.res.redirect('/')
         * */
        req.flash("success", req.session.user.name + "   loginout successing");
        setTimeout(req.session.user = null, 1000);
        res.redirect('/');

    })

}

// ensure logging
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '用户未登录');
        res.redirect('/login');
    }
    next();
}

//ensure unlogging

function checkUnlogin(req, res, next) {
    if (req.session.user) {
        req.flash("error", '用户已经登录');
        res.redirect('back');
    }
    next();
}


module.exports = routes;