/**
 * Created by LocNT on 7/28/15.
 */

var mysql     =    require('mysql');

//server 188.166.237.78 for disploy
var DB_CONFIG = {
    connectionLimit : 100, //important
    host : 'localhost',
    user : 'root',
    password : 'Chomoi2015',
    database : 'chomoidb_dev',
    debug    :  false
};


//server 6recipese
//var DB_CONFIG = {
//    connectionLimit : 100, //important
//    host     : '6recipes.com',
//    user     : '6recipe',
//    password : '6recipe',
//    database : '6recipe',
//    debug    :  false
//}

/*var DB_CONFIG = {
    connectionLimit : 101, //important
    host     : 'localhost',//188.166.237.78
   // port : 3306,
    user     : 'root',
    password : 'Devchomoi2015',
    database : 'chomoidb',
    debug    :  false
}*/

exports.pool = mysql.createPool(DB_CONFIG);