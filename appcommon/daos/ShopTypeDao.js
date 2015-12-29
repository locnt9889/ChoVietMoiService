/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var shopTypeDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_TYPE.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

shopTypeDao.getShopTypeByShop = function(shopID){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.GET_SHOP_TYPE_BY_SHOP;
    var params = [shopID];
    return shopTypeDao.queryExecute(sql, params);
};

shopTypeDao.addMultiShopType = function(array){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SLQ_ADD_NEW_MULTI_SHOP_TYPE;
    var params = [array];
    return shopTypeDao.queryExecute(sql, params);
};

shopTypeDao.removeMultiShopTypeById = function(shopID, shopTypeIdListStr){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SLQ_REMOVE_MULTI_SHOP_TYPE + shopTypeIdListStr;
    var params = [shopID];
    return shopTypeDao.queryExecute(sql, params);
};

shopTypeDao.removeAllShopTypeOfShop = function(shopID){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SLQ_REMOVE_ALL_SHOP_TYPE_OF_SHOP;
    var params = [shopID];
    return shopTypeDao.queryExecute(sql, params);
};

/*Export*/
module.exports = shopTypeDao;