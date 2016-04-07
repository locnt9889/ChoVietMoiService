/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var commentProductNotificationDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_COMMENT_PRODUCT_NOTIFICATION.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

commentProductNotificationDao.getShopInfoByProduct = function(productId){
    var def = Q.defer();

    var sql = SqlQueryConstant.PRODUCT_SQL_SCRIPT.GET_SHOP_INFO_BY_PRODUCT;
    var param = [productId];
    commentProductNotificationDao.queryExecute(sql, param).then(function(data){
        def.resolve(data);
    }, function(err){
        def.reject(err);
    });

    return def.promise;

};

commentProductNotificationDao.countNotificationUnRead = function(userID){
    var def = Q.defer();

    var sql = SqlQueryConstant.COMMENT_SQL_SCRIPT.COUNT_NOTIFICATION_UNREAD;
    var param = [userID];
    commentProductNotificationDao.queryExecute(sql, param).then(function(data){
        def.resolve(data);
    }, function(err){
        def.reject(err);
    });

    return def.promise;

};

commentProductNotificationDao.getNotificationOfShop = function(shopID, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.COMMENT_SQL_SCRIPT.COUNT_SHOP_GET_NOTIFICATION;
    var paramCount = [shopID];
    commentProductNotificationDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = SqlQueryConstant.COMMENT_SQL_SCRIPT.SHOP_GET_NOTIFICATION;
        var params = [shopID, start, perPage];
        commentProductNotificationDao.queryExecute(sql, params).then(function(data1){
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
module.exports = commentProductNotificationDao;