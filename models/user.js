var mongodb = require('./db');

function User(user) {
    /** @namespace this.name */
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}


module.exports = User;


//存储用户信息
User.prototype.save = function (callback) {
//    要存入数据库的文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
//    打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //    读取user 集合
        db.collection('users', function (err, collections) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collections.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);
            })
            
        })
        
        
    })
};
//获取用户信息
User.get = function (name, callback) {
//    打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //    读取user集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //    查找特定文档.
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            })
        })
        
    })
};


