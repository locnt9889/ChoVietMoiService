/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
//var DbConfig = require("./DatabaseConfig");
//var pool = DbConfig.pool;
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var userContactDao = new MysqlHelper(Constant.TABLE_NAME_DB.USER_CONTACTS.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

userContactDao.getUserContactStatusByValue = function(value){
    var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.USER_CONTACT_STATUS_SCRIPT.GET_USER_STATUS_ID_BY_VALUE;
    var params = [value];
    return userContactDao.queryExecute(sql, params);
};

userContactDao.addMultiContact = function(array){
    var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_ADD_NEW_MULTI;
    var params = [array];
    return userContactDao.queryExecute(sql, params);
};

userContactDao.findByUserAndFriend = function(userID, friendID){
    var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_FIND_BY_USER_AND_FRIEND;
    var params = [userID, friendID];
    return userContactDao.queryExecute(sql, params);
};

userContactDao.updateStatusToFriendFor2 = function(statusID, userID, friendID){
    var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_UPDATE_STATUS_TO_FRIEND;
    var params = [statusID, userID, friendID, friendID, userID];
    return userContactDao.queryExecute(sql, params);
};

userContactDao.deleteToFriendFor2 = function(userID, friendID){
    var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_DELETE_CONTACT;
    var params = [userID, friendID, friendID, userID];
    return userContactDao.queryExecute(sql, params);
};

userContactDao.updateStatus= function(statusID, userID, friendID){
    var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_UPDATE_STATUS;
    var params = [statusID, userID, friendID];
    return userContactDao.queryExecute(sql, params);
};

userContactDao.findUserContactByUserID = function(userID, statusValue, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum - 1);

    var extSQL = "";

    if(Constant.USER_CONTACT_STATUS_VALUE.ALL != statusValue){
        extSQL = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_USER_CONTACT_BY_USER_EXT + "'" + statusValue + "'";
    }

    var sqlCount = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_COUNT_USER_CONTACT_BY_USER.replace("#ext", extSQL);
    var paramCount = [userID];
    userContactDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = SqlQueryConstant.USER_CONTACT_SQL_SCRIPT.SLQ_FIND_USER_CONTACT_BY_USER_PAGING.replace("#ext", extSQL);
        var params = [userID, start, perPage];
        userContactDao.queryExecute(sql, params).then(function(data1){
            for(var i = 0; i < data1.length; i++){
                data1[i].passWord = "******";
            }
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
module.exports = userContactDao;