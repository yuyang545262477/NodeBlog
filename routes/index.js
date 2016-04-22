var crypto = require('crypto');

var User = require('../models/users');


function title(title,req) {
    this.title = title;
    this.user = req.session.user;
    this.success = req.flash('success').toString();
    this.error = req.flash('error').toString();
}
function routes(app) {
    app.get('/', function (req, res) {
        res.render('index', title('index',req));
    });
    app.get('/reg', function (req, res) {
        res.render('reg', title('register',req));
    });


    app.post('/reg', function (req, res) {
        //step one:    get datas from font-end
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password_repeat'],
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
        User.get(newUser.name, function (err, user) {
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
                req.session.user = user;
                req.flash('success', 'succesing add');
                return res.redirect('/');
            });
        });

    });

    app.get('/login', function (req, res) {
        res.render('login', title('login',req));
    });
    app.get('/post', function (req, res) {
        res.render('post', {title: 'post'});
    });
    app.post('/post', function (req, res) {
        res.render('post', {title: 'post'});
    });


    app.get('/logout', function (reg, res) {
    })

}


module.exports = routes;