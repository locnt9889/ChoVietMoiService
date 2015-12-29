/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var categoryDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_CATEGORY.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

categoryDao.checkCategoryNameOfShopExist = function(shopID, name){
    var sql = SqlQueryConstant.CATEGORY_SQL_SCRIPT.CHECK_CATEGORY_NAME_OF_SHOP_EXIST;
    var params = [shopID, name];
    return categoryDao.queryExecute(sql, params);
};

categoryDao.getCategoryByShop = function(shopID){
    var sql = SqlQueryConstant.CATEGORY_SQL_SCRIPT.GET_CATEGORY_BY_SHOP;
    var params = [shopID];
    return categoryDao.queryExecute(sql, params);
};

categoryDao.checkPermissionUserAndCategory = function(userID, categoryID){
    var sql = SqlQueryConstant.CATEGORY_SQL_SCRIPT.CHECK_PERMISSION_USER_AND_CATEGORY
    var params = [userID, categoryID];
    return categoryDao.queryExecute(sql, params);
};

/*Export*/
module.exports = categoryDao;