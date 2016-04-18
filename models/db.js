/*
 * 根据配置信息,配置数据库
 * */

var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Serve = require('mongodb').Server;


modules.exports = new Db(settings.db, new Serve(settings.host, settings.port),{safe:true});




    
    
