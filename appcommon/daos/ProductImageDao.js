/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var productImageDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_PRODUCT_IMAGE.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

productImageDao.getImageByProduct = function(productID, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.PRODUCT_SQL_SCRIPT.COUNT_GET_IMAGE_BY_PRODUCT;
    var paramCount = [productID];
    productImageDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = SqlQueryConstant.PRODUCT_SQL_SCRIPT.GET_IMAGE_BY_PRODUCT;
        var params = [productID, start, perPage];
        productImageDao.queryExecute(sql, params).then(function(data1){
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

productImageDao.getAllImageByProduct = function(productID){
    var sql = SqlQueryConstant.PRODUCT_SQL_SCRIPT.GET_ALL_IMAGE_BY_PRODUCT;
    var params = [productID];
    return productImageDao.queryExecute(sql, params);
};

/*Export*/
module.exports = productImageDao;