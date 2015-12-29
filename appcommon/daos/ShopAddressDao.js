/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var shopAddressDao = new MysqlHelper(Constant.TABLE_NAME_DB.SHOP_ADDRESS.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

shopAddressDao.getAddressByShop = function(shopID){
    var sql = SqlQueryConstant.SHOP_ADDRESS_SQL_SCRIPT.GET_ADDRESS_BY_SHOP;
    var params = [shopID];
    return shopAddressDao.queryExecute(sql, params);
};

/*Export*/
module.exports = shopAddressDao;