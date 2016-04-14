/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var productCommentDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_PRODUCT_COMMENTS.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

productCommentDao.getCommentByProductID = function(productID, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.COMMENT_SQL_SCRIPT.COUNT_GET_COMMENT_BY_PRODUCT;
    var paramCount = [productID];
    productCommentDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = SqlQueryConstant.COMMENT_SQL_SCRIPT.GET_COMMENT_BY_PRODUCT;
        var params = [productID, start, perPage];
        productCommentDao.queryExecute(sql, params).then(function(data1){
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

productCommentDao.getCommentByParent = function(parentID, pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.COMMENT_SQL_SCRIPT.COUNT_GET_COMMENT_BY_PARENT;
    var paramCount = [parentID];
    productCommentDao.queryExecute(sqlCount, paramCount).then(function(data){
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

        var sql = SqlQueryConstant.COMMENT_SQL_SCRIPT.GET_COMMENT_BY_PARENT;
        var params = [parentID, start, perPage];
        productCommentDao.queryExecute(sql, params).then(function(data1){
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

productCommentDao.getUserCommentByParent = function(parentID, productID){
    var def = Q.defer();

    var sql = SqlQueryConstant.COMMENT_SQL_SCRIPT.GET_USER_COMMENT_BY_PARENT;
    var param = [parentID, productID];
    productCommentDao.queryExecute(sql, param).then(function(data){
        var sql1 = SqlQueryConstant.COMMENT_SQL_SCRIPT.GET_OWNER_USER_COMMENT_BY_ID;
        var param1 = [parentID];
        productCommentDao.queryExecute(sql1, param1).then(function(data1){
            if(data1.length > 0){
                data = data.push(data1[0]);
            }
            def.resolve(data);
        }, function(err){
            def.reject(err);
        });
    }, function(err){
        def.reject(err);
    });

    return def.promise;
};

/*Export*/
module.exports = productCommentDao;