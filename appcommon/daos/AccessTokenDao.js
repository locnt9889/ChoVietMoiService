/**
 * Created by LocNT on 7/30/15.
 */

var Q = require("q");

var SqlQueryContant = require("../helpers/SqlQueryContant");
var MysqlHelper = require("../helpers/MysqlHelper");

var AccessTokenDao = new MysqlHelper("User_Access_Token");

var checkAccessToken = function(accessToken){
    var deffered = Q.defer();
    var sql = SqlQueryContant.USER_SQL_SCRIPT.SQL_CHECK_ACCESS_TOKEN;
    var params = [accessToken];

    AccessTokenDao.queryExecute(sql,params).then(function(result){
        deffered.resolve(result);
    },function(err){
        deffered.reject(err);
    });

    return deffered.promise;
}

var removeAllOtherAccessTokenByUserId = function(accessToken, userId){
    var deffered = Q.defer();
    var sql = SqlQueryContant.USER_SQL_SCRIPT.SLQ_REMOVE_ALL_OTHER_BY_USER;
    var params = [accessToken, userId];

    AccessTokenDao.queryExecute(sql,params).then(function(result){
        deffered.resolve(result);
    },function(err){
        deffered.reject(err);
    });

    return deffered.promise;
}

/*Export*/
MysqlHelper.prototype.checkAccessToken = checkAccessToken;
MysqlHelper.prototype.removeAllOtherAccessTokenByUserId = removeAllOtherAccessTokenByUserId;
module.exports = AccessTokenDao;