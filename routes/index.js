function routes(app) {
    app.get('/', function (req, res) {
        res.render('index', {title: 'index'});
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {title: 'register'});
    });

    app.get('/login', function (req, res) {
        res.render('login', {title: 'login'});
    });
    app.get('/post', function (req, res) {
        res.render('post', {title: 'post'});
    });
    app.get('/logout', function (reg, res) {
    })

}


module.exports = routes;