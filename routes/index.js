module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {title: 'hello world '});
    });
    app.get('/yuyang', function (req, res) {
        res.render('yuyang', {title: 'yuyang'});
    })
};