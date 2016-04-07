/**
 * Created by LocNT on 7/29/15.
 */
var MD5 = require("MD5");
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
var multiparty = require('multiparty');

var commentProductNotificationDao = require("../daos/CommentProductNotificationDao");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var CommentProductNotification = require("../models/CommentProductNotification");

var Constant = require("../helpers/Constant");
var message = require("../message/en");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");


var countNotification = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    commentProductNotificationDao.countNotificationUnRead(userID).then(function(data){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data[0];
        res.send(responseObj);
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var setNotificationIsRead = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var id = req.body.id ? req.body.id : 0;

    commentProductNotificationDao.update({isRead : 1}, Constant.TABLE_NAME_DB.SHOP_COMMENT_PRODUCT_NOTIFICATION.NAME_FIELD_ID, id).then(function (data) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data;
        res.send(responseObj);
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var getNotificatiOfShop = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var shopID = isNaN(req.body.shopID) || !req.body.shopID ? 0 : parseInt(req.body.shopID);
    var pageNum = isNaN(req.body.pageNum) || !req.body.pageNum ? 1 : parseInt(req.body.pageNum);
    var perPage = isNaN(req.body.perPage) || !req.body.perPage? 10 : parseInt(req.body.perPage);

    commentProductNotificationDao.getNotificationOfShop(shopID, pageNum, perPage).then(function(data){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data;
        res.send(responseObj);
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var getNotificatiOfUser = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var pageNum = isNaN(req.body.pageNum) || !req.body.pageNum ? 1 : parseInt(req.body.pageNum);
    var perPage = isNaN(req.body.perPage) || !req.body.perPage? 10 : parseInt(req.body.perPage);

    commentProductNotificationDao.getNotificationOfUser(userID, pageNum, perPage).then(function(data){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data;
        res.send(responseObj);
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

/*Exports*/
module.exports = {
    countNotification : countNotification,
    setNotificationIsRead : setNotificationIsRead,
    getNotificatiOfShop : getNotificatiOfShop,
    getNotificatiOfUser : getNotificatiOfUser
}



