/*
 * 建立文件模型
 * */

var mongodb = require('./db');


//原型函数

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

Post.prototype.save = function (callback) {
    //    初定义时间
    var date = new Date();
    //    建立时间对象.
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
//   准备存入数据库的东西.
    var post = {
        name: this.name,
        time: this.time,
        title: this.title,
        post: this.post
    };

//    打开数据库,然后进行操作.
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(Post, {safe: true}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
};


//读取文章.
Post.get = function (name, callback) {
//    打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //    声明查询的内容.
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({time: -1}).toArray(function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }   
                return callback(null, doc);
            });
        });
    });
};
