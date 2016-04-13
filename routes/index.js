/*
 * 这里的型参,假设就是express的实例,事实上,也是.
 * */

function routes(app) {
    app.get('/', function (req, res) {
        res.render('index', {title: '主页.'});
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {title: '注册页面'})
    });
    app.get('/post', function (req, res) {
        res.render('post', {title: '文章发表页面'})
    });
    app.get('/login', function (req, res) {
        res.render('login', {title: '登录页面'})
    });

}

module.exports = routes;