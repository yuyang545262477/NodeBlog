module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {title: 'hello world '});
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {title: 'reg'});
    });
    app.get('/login', function (req, res) {
        res.render('login', {title: 'login'});
    });
    app.get('/post', function (req, res) {
        res.render('post', {title: 'post'});
    });
    app.get('/logout', function (req, res) {
    });
};