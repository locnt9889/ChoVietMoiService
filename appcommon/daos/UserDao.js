/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
//var DbConfig = require("./DatabaseConfig");
//var pool = DbConfig.pool;
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var userDao = new MysqlHelper(Constant.TABLE_NAME_DB.USER.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");


userDao.test = function(){
    console.log("test");
}

userDao.checkEmailExist = function(email){
    var sql = SqlQueryConstant.USER_SQL_SCRIPT.CHECK_EMAIL_EXIST;
    var params = [email];
    return userDao.queryExecute(sql, params);
};

userDao.getUserStatusByValue = function(value){
    var sql = SqlQueryConstant.USER_SQL_SCRIPT.USER_STATUS_SCRIPT.GET_USER_STATUS_ID_BY_VALUE;
    var params = [value];
    return userDao.queryExecute(sql, params);
};

userDao.checkLogin = function(email, password){
    var sql = SqlQueryConstant.USER_SQL_SCRIPT.CHECK_LOGIN;
    var params = [email, password];
    return userDao.queryExecute(sql, params);
};

userDao.findDeviceTokenByValue = function(deviceToken){
    var sql = SqlQueryConstant.USER_SQL_SCRIPT.FIND_DEVICE_TOKEN_BY_VALUE;
    var params = [deviceToken];
    return userDao.queryExecute(sql, params);
};

userDao.changePassword = function(userID, newPasswordMD5){
    var sql = SqlQueryConstant.USER_SQL_SCRIPT.SLQ_CHANGE_PASSWORD;
    var params = [newPasswordMD5, userID];
    return userDao.queryExecute(sql, params);
};

userDao.getUserProfileById = function(userID){
    var sql = SqlQueryConstant.USER_SQL_SCRIPT.SQL_GET_USER_PROFILE;
    var params = [userID];
    return userDao.queryExecute(sql, params);
};

userDao.searchUser = function(userID, searchText, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);
    var text = "%" + searchText + "%";

    var sqlCount = SqlQueryConstant.USER_SQL_SCRIPT.SQL_COUNT_NUMBER_SEARCH_USER;
    var paramCount = [userID, text, text];
    userDao.queryExecute(sqlCount, paramCount).then(function(data){
        var responsePagingDto = new ResponsePagingDto();
        var totalItems = data[0].totalItems;
        var totalPages = parseInt(totalItems / perPage);
        if((totalItems / perPage) > totalPages){
            totalPages = totalPages + 1;
        }

        responsePagingDto.pageNum = pageNum;
        responsePagingDto.perPage = perPage;
        responsePagingDto.totalItems = totalItems;
        responsePagingDto.totalPages = totalPages;

        var sql = SqlQueryConstant.USER_SQL_SCRIPT.SQL_SEARCH_USER;
        var params = [userID, userID, text, text, start, perPage];
        userDao.queryExecute(sql, params).then(function(data1){
            responsePagingDto.items = data1;

            def.resolve(responsePagingDto);
        }, function(err){
            def.reject(err);
        });
    }, function(err){
        def.reject(err);
    });

    return def.promise;

};

/*Export*/
module.exports = userDao;