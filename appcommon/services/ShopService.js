/**
 * Created by LocNT on 7/29/15.
 */
var MD5 = require("MD5");
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
var multiparty = require('multiparty');

var UploadResponseDTO = require("../modelsDto/UploadResponseDTO");

var shopDao = require("../daos/ShopDao");
var shopTypeDao = require("../daos/ShopTypeDao");
var shopDistrictDao = require("../daos/ShopDistrictDao");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var Shop = require("../models/Shop");
var ShopType = require("../models/ShopType");
var ShopDistrict = require("../models/ShopDistrict");
var ShopUpdateDto = require("../modelsDto/ShopUpdateDto");

var Constant = require("../helpers/Constant");
var message = require("../message/en");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");
var uploadFileHelper = require("../helpers/UploadFileHelper");

var saveShopTypeForShop = function(shopID, shopTypeIDList){
    var shopTypeModelList = [];
    for(var i = 0; i < shopTypeIDList.length; i++){
        var shopType = new ShopType();
        shopType.shopID = shopID;
        var id = isNaN(shopTypeIDList[i])? 0 : parseInt(shopTypeIDList[i]);
        if(id > 0){
            shopType.shopTypeChildID = id;
            var shopTypeAttrArray = [shopType.id, shopType.shopID, shopType.shopTypeChildID, shopType.createdDate];
            shopTypeModelList.push(shopTypeAttrArray);
        }
    }

    shopTypeDao.addMultiShopType(shopTypeModelList).then(function (result) {
        console.log("add shop type for create shop success");
    }, function (err) {
        console.log("add shop type for create shop error");
    });
};

var saveDistrictForShop = function(shopID, districtIDList){
    var districtModelList = [];
    for(var i = 0; i < districtIDList.length; i++){
        var shopDistrict = new ShopDistrict;
        shopDistrict.shopID = shopID;
        var id = isNaN(districtIDList[i])? 0 : parseInt(districtIDList[i]);
        if(id > 0){
            shopDistrict.districtID = id;
            var districtAttrArray = [shopDistrict.id, shopDistrict.shopID, shopDistrict.districtID, shopDistrict.createdDate];
            districtModelList.push(districtAttrArray);
        }
    }

    shopDistrictDao.addMultiShopDistrict(districtModelList).then(function (result) {
        console.log("add district for create shop success");
    }, function (err) {
        console.log("add district for create shop error");
    });
}

var createShop = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var name = req.body.name ? req.body.name : "";
    var shopTypeIds = req.body.shopTypeIds ? req.body.shopTypeIds : "";
    var districtIds = req.body.districtIds ? req.body.districtIds : "";

    if(checkValidateUtil.isEmptyFeild(name) || checkValidateUtil.isEmptyFeild(shopTypeIds) || checkValidateUtil.isEmptyFeild(districtIds)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.CREATE_SHOP_EMPTY_FIELD;
        responseObj.errorsObject = message.SHOP.CREATE_SHOP_EMPTY_FIELD;
        responseObj.errorsMessage = message.SHOP.CREATE_SHOP_EMPTY_FIELD.message;
        res.send(responseObj);
        return;
    }

    var shopTypeIdList = shopTypeIds.split(";");
    var districtIdList = districtIds.split(";");


    shopDao.checkShopNameOfUserExist(userID, name).then(function(data){
        if(data.length == 0){
            shopDao.getShopStatusByValue(Constant.SHOP_STATUS_VALUE.ACTIVE).then(function(status){
                var shopStatusID = 0;
                if(status.length > 0){
                    shopStatusID = status[0].shopStatusID;
                }
                var shop = new Shop();
                shop.userID = userID;
                shop.shopName = name;
                shop.isActive = true;
                shop.shopStatusID = shopStatusID;

                shopDao.addNew(shop).then(function(result){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                    responseObj.results = result;
                    res.send(responseObj);

                    saveShopTypeForShop(result.insertId, shopTypeIdList);
                    saveDistrictForShop(result.insertId, districtIdList)
                },function(err){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                    responseObj.errorsObject = err;
                    responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                    res.send(responseObj);
                });
            },function(err){
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                res.send(responseObj);
            });
        }else{
            responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.CREATE_SHOP_NAME_OF_USER_EXIST;
            responseObj.errorsObject = message.SHOP.CREATE_SHOP_NAME_OF_USER_EXIST;
            responseObj.errorsMessage = message.SHOP.CREATE_SHOP_NAME_OF_USER_EXIST.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var getShopByUser = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    shopDao.getShopByUser(userID).then(function(data){
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

var getShopTypeByShop = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var shopID = isNaN(req.body.shopID)? 0 : parseInt(req.body.shopID);

    shopTypeDao.getShopTypeByShop(shopID).then(function(data){
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

var getShopDistrictByShop = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var shopID = isNaN(req.body.shopID)? 0 : parseInt(req.body.shopID);

    shopDistrictDao.getShopDistrictByShop(shopID).then(function(data){
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

var updateTypeOfShop = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var shopID = isNaN(req.body.shopID)? 0 : parseInt(req.body.shopID);
    var shopTypeIds = req.body.shopTypeIds ? req.body.shopTypeIds : "";
    //var action = req.body.action ? req.body.action : "";

    if(checkValidateUtil.isEmptyFeild(shopTypeIds)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.CREATE_SHOP_EMPTY_FIELD;
        responseObj.errorsObject = message.SHOP.CREATE_SHOP_EMPTY_FIELD;
        responseObj.errorsMessage = message.SHOP.CREATE_SHOP_EMPTY_FIELD.message;
        res.send(responseObj);
        return;
    }

    if(shopID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
        res.send(responseObj);
        return;
    }

    /*if(action != 'REMOVE' && action != 'INSERT'){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_ACTION_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_ACTION_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_ACTION_INVALID.message;
        res.send(responseObj);
        return;
    }*/

    var shopTypeIDList = shopTypeIds.split(";");

    var shopTypeModelList = [];
    var shopTypeIdList = [];
    for(var i = 0; i < shopTypeIDList.length; i++){
        var shopType = new ShopType();
        shopType.shopID = shopID;
        var id = isNaN(shopTypeIDList[i])? 0 : parseInt(shopTypeIDList[i]);
        if(id > 0){
            shopType.shopTypeChildID = id;
            var shopTypeAttrArray = [shopType.id, shopType.shopID, shopType.shopTypeChildID, shopType.createdDate];
            shopTypeModelList.push(shopTypeAttrArray);
            shopTypeIdList.push(id);
        }
    }

    var shopTypeIdListStr = "(" + shopTypeIdList.join() + ")";

    //remove
    shopTypeDao.removeAllShopTypeOfShop(shopID).then(function (result) {
        console.log("remove all shop type of shop success");
        //if(action == 'REMOVE'){
        //    responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        //    responseObj.results = result;
        //    res.send(responseObj);
        //}else if(action == 'INSERT'){    //insert
            shopTypeDao.addMultiShopType(shopTypeModelList).then(function (data) {
                console.log("add shop type for update shop success");
                responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                responseObj.results = data;
                res.send(responseObj);
            }, function (err) {
                console.log("add shop type for create shop error");
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                res.send(responseObj);
            });
        //}
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var updateDistrictOfShop = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var shopID = isNaN(req.body.shopID)? 0 : parseInt(req.body.shopID);
    var districtIds = req.body.districtIds ? req.body.districtIds : "";
    //var action = req.body.action ? req.body.action : "";

    if(checkValidateUtil.isEmptyFeild(districtIds)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.CREATE_SHOP_EMPTY_FIELD;
        responseObj.errorsObject = message.SHOP.CREATE_SHOP_EMPTY_FIELD;
        responseObj.errorsMessage = message.SHOP.CREATE_SHOP_EMPTY_FIELD.message;
        res.send(responseObj);
        return;
    }

    if(shopID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
        res.send(responseObj);
        return;
    }

    /*if(action != 'REMOVE' && action != 'INSERT'){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_ACTION_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_ACTION_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_ACTION_INVALID.message;
        res.send(responseObj);
        return;
    }*/

    var districtIDList = districtIds.split(";");

    var districtModelList = [];
    var districtIdlList = [];

    for(var i = 0; i < districtIDList.length; i++){
        var shopDistrict = new ShopDistrict;
        shopDistrict.shopID = shopID;
        var id = isNaN(districtIDList[i])? 0 : parseInt(districtIDList[i]);
        if(id > 0){
            shopDistrict.districtID = id;
            var districtAttrArray = [shopDistrict.id, shopDistrict.shopID, shopDistrict.districtID, shopDistrict.createdDate];
            districtModelList.push(districtAttrArray);
            districtIdlList.push(id);
        }
    }

    var districtIdListStr = "(" + districtIdlList.join() + ")";

    //remove
    shopTypeDao.removeAllShopDistrictOfShop(shopID).then(function (result) {
        console.log("remove district of shop success");
        //if(action == 'REMOVE'){
        //    responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        //    responseObj.results = result;
        //    res.send(responseObj);
        //}else if(action == 'INSERT'){    //insert
            shopTypeDao.addMultiShopDistrict(districtModelList).then(function (data) {
                console.log("add district shop success");
                responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                responseObj.results = data;
                res.send(responseObj);
            }, function (err) {
                console.log("add district shop error");
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                res.send(responseObj);
            });
        //}
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

//upload avatar of shop
var updateAvatarOfShop = function(req, res) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;
    var shopID = isNaN(req.query.shopID)? 0 : parseInt(req.query.shopID);

    if(shopID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
        res.send(responseObj);
        return;
    }

    var fileNamePre = "Shop_avatar_" + shopID;

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.UPLOAD_FAIL;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.UPLOAD_FILE.UPLOAD_FAIL.message;
            res.send(responseObj);
            return;
        }
        if(files.imageFile.length == 0 || files.imageFile[0].size == 0){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.ERROR_EMPTY_FILE;
            responseObj.errorsObject = message.UPLOAD_FILE.ERROR_EMPTY_FILE;
            responseObj.errorsMessage = message.UPLOAD_FILE.ERROR_EMPTY_FILE.message;
            res.send(responseObj);
            return;
        }
        if(files.imageFile[0].size > Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.SHOP_AVATAR){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsObject = message.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsMessage = message.UPLOAD_FILE.ERROR_LIMITED_SIZE.message;
            res.send(responseObj);
            return;
        }

        //var uploadResponseDTO = new UploadResponseDTO();

        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, fileNamePre,files.imageFile[0].path, Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.SHOP_AVATAR).then(function(fullFilePath){
            var uploadResponseDTO = new UploadResponseDTO();
            uploadResponseDTO.file = fullFilePath;

            shopDao.update({"avatarImageURL" : fullFilePath}, Constant.TABLE_NAME_DB.SHOP.NAME_FIELD_ID, shopID).then(function (result) {
                responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                responseObj.results = uploadResponseDTO;
                res.send(responseObj);
            }, function (err) {
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                res.send(responseObj);
            });

        },function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.UPLOAD_FAIL;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.UPLOAD_FILE.UPLOAD_FAIL.message;
            res.send(responseObj);
            return;
        });
    });
}

//upload Cover
var updateCoverOfShop = function(req, res) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var shopID = isNaN(req.query.shopID)? 0 : parseInt(req.query.shopID);

    if(shopID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
        res.send(responseObj);
        return;
    }

    var fileNamePre = "Shop_cover_" + shopID;

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.UPLOAD_FAIL;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.UPLOAD_FILE.UPLOAD_FAIL.message;
            res.send(responseObj);
            return;
        }
        if(files.imageFile.length == 0 || files.imageFile[0].size == 0){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.ERROR_EMPTY_FILE;
            responseObj.errorsObject = message.UPLOAD_FILE.ERROR_EMPTY_FILE;
            responseObj.errorsMessage = message.UPLOAD_FILE.ERROR_EMPTY_FILE.message;
            res.send(responseObj);
            return;
        }
        if(files.imageFile[0].size > Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.SHOP_COVER){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsObject = message.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsMessage = message.UPLOAD_FILE.ERROR_LIMITED_SIZE.message;
            res.send(responseObj);
            return;
        }

        //var uploadResponseDTO = new UploadResponseDTO();

        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, fileNamePre,files.imageFile[0].path, Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.SHOP_COVER).then(function(fullFilePath){
            var uploadResponseDTO = new UploadResponseDTO();
            uploadResponseDTO.file = fullFilePath;

            shopDao.update({"coverImageURL" : fullFilePath}, Constant.TABLE_NAME_DB.SHOP.NAME_FIELD_ID, shopID).then(function (result) {
                responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                responseObj.results = uploadResponseDTO;
                res.send(responseObj);
            }, function (err) {
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                res.send(responseObj);
            });

        },function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.UPLOAD_FAIL;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.UPLOAD_FILE.UPLOAD_FAIL.message;
            res.send(responseObj);
            return;
        });
    });
}

//delete shop
var deleteShop = function(req, res) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    var shopID = isNaN(req.body.shopID)? 0 : parseInt(req.body.shopID);

    if(shopID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
        res.send(responseObj);
        return;
    }

    shopDao.update({"isActive" : 0}, Constant.TABLE_NAME_DB.SHOP.NAME_FIELD_ID, shopID).then(function (result) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = result;
        res.send(responseObj);
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

//get detail shop
var getShopDetail = function (req, res) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    var shopID = isNaN(req.body.shopID)? 0 : parseInt(req.body.shopID);

    if(shopID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
        responseObj.errorsObject = message.SHOP.SHOP_INVALID;
        responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
        res.send(responseObj);
        return;
    }

    shopDao.findOneById(Constant.TABLE_NAME_DB.SHOP.NAME_FIELD_ID, shopID).then(function (result) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = result;
        res.send(responseObj);
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var updateShopInfo = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    var shopID = req.body.shopID ? req.body.shopID : "";
    var shopName = req.body.shopName ? req.body.shopName : "";
    var shopDesc = req.body.shopDesc ? req.body.shopDesc : "";
    var phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : "";

    var isShowPrice = req.body.isShowPrice ? req.body.isShowPrice : false;
    var isCanOrder = req.body.isCanOrder ? req.body.isCanOrder : false;
    var isCloseShop = req.body.isCloseShop ? req.body.isCloseShop : false;
    var closeShopMessage = req.body.closeShopMessage ? req.body.closeShopMessage : "";

    if(!accessTokenObj){
        responseObj.statusErrorCode = Constant.CODE_STATUS.ACCESS_TOKEN_INVALID;
        responseObj.errorsObject = message.ACCESS_TOKEN_INVALID;
        responseObj.errorsMessage = message.ACCESS_TOKEN_INVALID.message;
        res.send(responseObj);
    }else {
        var userID = accessTokenObj.userID;
        var shopUpdateDto = new ShopUpdateDto();
        shopUpdateDto.shopName = shopName;
        shopUpdateDto.shopDesc = shopDesc;
        shopUpdateDto.phoneNumber = phoneNumber;
        shopUpdateDto.isShowPrice = isShowPrice;
        shopUpdateDto.isCanOrder = isCanOrder;
        shopUpdateDto.isCloseShop = isCloseShop;
        shopUpdateDto.closeShopMessage = closeShopMessage;

        shopDao.findOneById(Constant.TABLE_NAME_DB.SHOP.NAME_FIELD_ID, shopID).then(function (data) {
            if(data.length == 0 ){
                responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_INVALID;
                responseObj.errorsObject = message.SHOP.SHOP_INVALID;
                responseObj.errorsMessage = message.SHOP.SHOP_INVALID.message;
                res.send(responseObj);
                return;
            }else{
                if(data[0].userID != userID){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.SHOP.SHOP_UPDATE_USER_IS_DENIED;
                    responseObj.errorsObject = message.SHOP.SHOP_UPDATE_USER_IS_DENIED;
                    responseObj.errorsMessage = message.SHOP.SHOP_UPDATE_USER_IS_DENIED.message;
                    res.send(responseObj);
                    return;
                }else{
                    shopDao.update(shopUpdateDto, Constant.TABLE_NAME_DB.SHOP.NAME_FIELD_ID, shopID).then(function (result) {
                        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                        responseObj.results = result;
                        res.send(responseObj);
                    }, function (err) {
                        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                        responseObj.errorsObject = err;
                        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                        res.send(responseObj);
                    });
                }
            }
        }, function (err) {
            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
            res.send(responseObj);
        });
    }
};

var search = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var provinceID = isNaN(req.body.provinceID) ? 0 : parseInt(req.body.provinceID);
    var districtID = isNaN(req.body.districtID) ? 0 : parseInt(req.body.districtID);
    var shopTypeParent = isNaN(req.body.shopTypeParent) ? 0 : parseInt(req.body.shopTypeParent);
    var shopTypeChild = isNaN(req.body.shopTypeChild) ? 0 : parseInt(req.body.shopTypeChild);

    var searchName = req.body.searchName ? req.body.searchName : "";

    //build sql
    var sql_getShopByDistrict = "SELECT DISTINCT shopID FROM Shop_District WHERE districtID = " + districtID;
    var sql_getShopByProvince = "SELECT DISTINCT shopID FROM Shop_District WHERE districtID IN (SELECT DISTINCT district_id FROM Data_District WHERE province_id = "+ provinceID +")";

    var sql_getShopByTypeChild = "SELECT DISTINCT shopID FROM Shop_Type WHERE shopTypeChildID = " + shopTypeChild;
    var sql_getShopByTypeParent = "SELECT DISTINCT shopID FROM Shop_Type WHERE shopTypeChildID IN (SELECT DISTINCT shopTypeChildID FROM Data_List_Shop_Type_Child WHERE shopTypeParentID = "+ shopTypeParent +")";

    var sql_search = "SELECT * FROM Shop WHERE isActive = 1";

    if(searchName.trim().length > 0){
        var searchNameArray = searchName.split(" ");
        for(var i = 0; i < searchNameArray.length; i++){
            sql_search = sql_search + " AND shopName LIKE '%" + searchNameArray[i] + "'"
        }
    }

    if(districtID > 0){
        sql_search = sql_search + " AND shopID IN ("+ sql_getShopByDistrict +")";
    }else{
        if(provinceID > 0){
            sql_search = sql_search + " AND shopID IN ( "+ sql_getShopByProvince +" )";
        }
    }

    if(shopTypeChild > 0){
        sql_search = sql_search + " AND shopID IN ("+ sql_getShopByTypeChild +")";
    }else{
        if(shopTypeParent > 0){
            sql_search = sql_search + " AND shopID IN ( "+ sql_getShopByTypeParent +" )";
        }
    }

    shopDao.queryExecute(sql_search,[]).then(function(data){
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

/**
 * get distance of 2 location
 * @param type latUser
 * @param type longUser
 * @param type shopTypeChild
 * @param type shopTypeParent
 * @param type distMin
 * @return double (mét)
 * round(acos(sin($lat1*pi()/180)*sin($lat2*pi()/180) + cos($lat1*pi()/180)*cos($lat2*PI()/180)*cos($long2*PI()/180-$long1*pi()/180)) * 6371000, 2)
 */
var getShopNear = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var latUser = isNaN(req.body.latUser) ? 0 : parseFloat(req.body.latUser);
    var longUser = isNaN(req.body.longUser) ? 0 : parseFloat(req.body.longUser);
    var shopTypeParent = isNaN(req.body.shopTypeParent) ? 0 : parseInt(req.body.shopTypeParent);
    var shopTypeChild = isNaN(req.body.shopTypeChild) ? 0 : parseInt(req.body.shopTypeChild);

    var distanceMax = isNaN(req.body.distanceMax) ? 0 : parseFloat(req.body.distanceMax);

    //build sql

    shopDao.getShopNearWithDistance(latUser, longUser, distanceMax, shopTypeChild, shopTypeParent).then(function(data){
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
    createShop : createShop,
    getShopByUser : getShopByUser,
    getShopTypeByShop : getShopTypeByShop,
    getShopDistrictByShop : getShopDistrictByShop,
    updateTypeOfShop : updateTypeOfShop,
    updateDistrictOfShop : updateDistrictOfShop,
    updateAvatarOfShop : updateAvatarOfShop,
    updateCoverOfShop : updateCoverOfShop,
    deleteShop : deleteShop,
    getShopDetail : getShopDetail,
    updateShopInfo : updateShopInfo,
    search : search,
    getShopNear : getShopNear
}



