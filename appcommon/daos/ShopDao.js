/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var shopDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

shopDao.checkShopNameOfUserExist = function(userID, name){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.CHECK_SHOP_NAME_OF_USER_EXIST;
    var params = [userID, name];
    return shopDao.queryExecute(sql, params);
};

shopDao.getShopStatusByValue = function(value){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SHOP_STATUS_SCRIPT.GET_SHOP_STATUS_ID_BY_VALUE;
    var params = [value];
    return shopDao.queryExecute(sql, params);
};

shopDao.getShopByUser = function(userID){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.GET_SHOP_BY_USER;
    var params = [userID];
    return shopDao.queryExecute(sql, params);
};

/**
 * get distance of 2 location
 * @param type latUser
 * @param type longUser
 * @param type shopTypeChild
 * @param type shopTypeParent
 * @param type distanceMax
 * @return double (mét)
 * round(acos(sin($lat1*pi()/180)*sin($lat2*pi()/180) + cos($lat1*pi()/180)*cos($lat2*PI()/180)*cos($long2*PI()/180-$long1*pi()/180)) * 6371000, 2)
 */

shopDao.getShopNearWithDistance = function(latUser, longUser, distanceMax, shopTypeChild, shopTypeParent){
    var sql_getShopByTypeChild = "SELECT DISTINCT shopID FROM Shop_Type WHERE shopTypeChildID = " + shopTypeChild;
    var sql_getShopByTypeParent = "SELECT DISTINCT shopID FROM Shop_Type WHERE shopTypeChildID IN (SELECT DISTINCT shopTypeChildID FROM Data_List_Shop_Type_Child WHERE shopTypeParentID = "+ shopTypeParent +")";

    var sql = "SELECT sh.*, sa.* , " +
        "round(acos(sin(?*pi()/180)*sin(sa.latitude*pi()/180) + cos(?*pi()/180)*cos(sa.latitude*PI()/180)*cos(?*PI()/180-sa.longtitude*pi()/180)) * 6371000, 2) AS distanceM " +
        "FROM `Shop_Address` sa INNER JOIN Shop sh ON sa.shopID = sh.shopID " +
        "WHERE 1 #andType " +
        "GROUP By sh.shopID " +
        "HAVING distanceM <= ?";
    var params = [latUser, latUser, longUser, distanceMax];

    if(shopTypeChild > 0){
        sql = sql.replace("#andType", "AND sh.shopID IN ("+ sql_getShopByTypeChild +")");
    }else{
        if(shopTypeParent > 0){
            sql = sql.replace("#andType", "AND sh.shopID IN ("+ sql_getShopByTypeParent +")");
        }else{
            sql = sql.replace("#andType", "");
        }
    }

    return shopDao.queryExecute(sql, params);
};

shopDao.search = function(select_search_count, select_search, sql_search, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = select_search_count + sql_search;
    var paramCount = [];
    shopDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = select_search + sql_search + " LIMIT ?,?";
        var params = [start, perPage];
        shopDao.queryExecute(sql, params).then(function(data1){
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
module.exports = shopDao;