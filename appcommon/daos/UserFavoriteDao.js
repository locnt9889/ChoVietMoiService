/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var userFavoriteDao = new MysqlHelper(Constant.TABLE_NAME_DB.USER_FAVORITE_ITEMS.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

var TYPE_VALUE = {
    SHOP : "SHOP",
    PRODUCT : "PRODUCT",
    ALL : "ALL"
}

userFavoriteDao.checkFavoriteUserAndItem = function(userID, itemID, type){
    var sql = SqlQueryConstant.USER_FAVORITE_SQL_SCRIPT.CHECK_FAVORITE_USER_AND_ITEM;
    var params = [userID, itemID, type];
    return userFavoriteDao.queryExecute(sql, params);
};

userFavoriteDao.getListFavorite = function(userID, favoriteType, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.USER_FAVORITE_SQL_SCRIPT.GET_LIST_FAVORITE_COUNT;
    var paramCount = [userID];

    var sql = SqlQueryConstant.USER_FAVORITE_SQL_SCRIPT.GET_LIST_FAVORITE;
    var params = [userID, start, perPage];

    var extend = " AND favoriteType = '" + favoriteType + "'";

    if(favoriteType != TYPE_VALUE.ALL){
        sqlCount = sqlCount + extend;
        sql = sql.replace("#ext", extend);
    }else{
        sql = sql.replace("#ext", "");
    }

    userFavoriteDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        userFavoriteDao.queryExecute(sql, params).then(function(data1){
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
module.exports = userFavoriteDao;