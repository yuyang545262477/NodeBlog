var mongodb = require('./db');

//函数原型
function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;


//增加保存的原型链.
User.prototype.save = function (callback) {
//    要存入数据库的文档.
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
//    打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            console.log("打开数据库失败");
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log("进入users失败");
                return callback(err);
            }
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    console.log("写入数据失败");
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
};


//读取用户信息.
User.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            console.log("打开数据库失败");
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log("打开users失败");
                return callback(err);
            }
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    console.log("查询失败");
                    return callback(err);
                }
                return callback(null, user);
            })
        })

    })
};



