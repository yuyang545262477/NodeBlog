var mognodb = require('./db');


function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;

}

module.exports = User;

//存储用户资料

User.prototype.save = function (callback) {
    //get user information
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
//    open mongodb
    mognodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.insert(user, {safe: true}, function (err, user) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);

            })

        })

    })

};


// reading user information

User.get = function (name, callback) {
//    open db
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            //    find someOne
            collection.findOne({name: name}, function (err, user) {
                db.close();
                if (err) {
                    return callback(err);
                }
                return callback(null, user);

            })

        })

    })
};