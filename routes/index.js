/*
 * 这里的型参,假设就是express的实例,事实上,也是.
 * */

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