/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var shopDistrictDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_DISTRICT.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

shopDistrictDao.getShopDistrictByShop = function(shopID){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.GET_SHOP_DISTRICT_BY_SHOP;
    var params = [shopID];
    return shopDistrictDao.queryExecute(sql, params);
};

shopDistrictDao.addMultiShopDistrict = function(array){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SLQ_ADD_NEW_MULTI_DISTRICT;
    var params = [array];
    return shopDistrictDao.queryExecute(sql, params);
};

shopDistrictDao.removeMultiShopDistrictById = function(shopID, districtIdListStr){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SLQ_REMOVE_MULTI_SHOP_DISTRICT + districtIdListStr;
    var params = [shopID];
    return shopDistrictDao.queryExecute(sql, params);
};

shopDistrictDao.removeAllShopDistrictOfShop = function(shopID){
    var sql = SqlQueryConstant.SHOP_SQL_SCRIPT.SLQ_REMOVE_ALL_SHOP_DISTRICT_OF_SHOP;
    var params = [shopID];
    return shopDistrictDao.queryExecute(sql, params);
};

/*Export*/
module.exports = shopDistrictDao;