/*
 * 1.import package
 * 2.construct function
 * 3.export it.
 * 4.prototype function.save
 * 5.prototype function.get
 */


//1.    import package
var mongodb = require('./db');

//2.    constrctor function
function Post(name, title, content) {
    this.name = name;
    this.title = title;
    this.content = content;
}
//3.    export it

module.exports = Post;

//4.    prototype.save

Post.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    var post = {
        name: this.name,
        title: this.title,
        content: this.content,
        time: time
    };
//    open mongodb
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(post, {safe: true}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
};
//5.    pototype.get

Post.get = function (name, callback) {
//    open mongodb
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            var query = {};
            if (name) {
                query.name = name;
            }
            //    starting query
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null, docs);
            })

        })
    })
};
