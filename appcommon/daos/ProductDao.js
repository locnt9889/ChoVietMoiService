/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var productDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_PRODUCT.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

productDao.checkProductNameOfCategoryExist = function(categoryID, name){
    var sql = SqlQueryConstant.PRODUCT_SQL_SCRIPT.CHECK_PRODUCT_NAME_OF_CATEGORY_EXIST;
    var params = [categoryID, name];
    return productDao.queryExecute(sql, params);
};

productDao.getProductByCategory = function(categoryID, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.PRODUCT_SQL_SCRIPT.COUNT_PRODUCT_BY_CATEGORY;
    var paramCount = [categoryID];
    productDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = SqlQueryConstant.PRODUCT_SQL_SCRIPT.GET_PRODUCT_BY_CATEGORY;
        var params = [categoryID, categoryID, start, perPage];
        productDao.queryExecute(sql, params).then(function(data1){
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

productDao.checkIsShopCommentProduct = function(userID, productID){
    var sql = SqlQueryConstant.PRODUCT_SQL_SCRIPT.CHECK_PERMISSION_USER_AND_PRODUCT;
    var params = [userID, productID];
    return productDao.queryExecute(sql, params);
};

productDao.search = function(sql_search, selectStr, countStr, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = countStr + sql_search;
    var paramCount = [];
    productDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = selectStr + sql_search + " LIMIT ?,?";
        var params = [start, perPage];
        productDao.queryExecute(sql, params).then(function(data1){
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
module.exports = productDao;