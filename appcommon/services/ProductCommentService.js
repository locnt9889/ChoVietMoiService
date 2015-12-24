/**
 * Created by LocNT on 7/29/15.
 */
var MD5 = require("MD5");
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
var multiparty = require('multiparty');

var UploadResponseDTO = require("../modelsDto/UploadResponseDTO");

var productDao = require("../daos/ProductDao");
var productCommentDao = require("../daos/ProductCommentDao");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var ProductComment = require("../models/ProductComment");

var Constant = require("../helpers/Constant");
var message = require("../message/en");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");
var uploadFileHelper = require("../helpers/UploadFileHelper");

var addNewProductComment = function(req, res, responseObj,  productComment){
    productCommentDao.addNew(productComment).then(function(result){
        productComment.commentID = result.insertId;
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = productComment;
        res.send(responseObj);
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var addNewCommentImage = function(req, res, responseObj,  productComment){
    var fileNamePre = "Comment_Image_" + productComment.productID + "_" + productComment.userID;

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
        var preFolderImage = Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.PRODUCT_IMAGE + productComment.productID + Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.SUB_COMMENT_IMAGE;
        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, fileNamePre,files.imageFile[0].path, preFolderImage).then(function(fullFilePath){
            productComment.commentValue = fullFilePath;
            addNewProductComment(req, res, responseObj,  productComment);
        },function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.UPLOAD_FAIL;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.UPLOAD_FILE.UPLOAD_FAIL.message;
            res.send(responseObj);
            return;
        });
    });
}

var createComment = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var productID = isNaN(req.body.productID) || !req.body.productID ? 0 : parseInt(req.body.productID);
    var commentParentID = isNaN(req.body.commentParentID) || !req.body.commentParentID ? 0 : parseInt(req.body.commentParentID);

    var commentValue = req.body.commentValue ? req.body.commentValue : "";
    var commentType = req.body.commentType ? req.body.commentType : Constant.COMMENT_TYPE.TEXT;
    var isShop = isNaN(req.body.isShop) || !req.body.isShop ? 0 : parseInt(req.body.isShop);

    var productComment = new ProductComment();
    productComment.commentType = commentType;
    productComment.parent_CommentID = commentParentID;
    productComment.productID = productID;
    productComment.userID = userID;
    productComment.isShopComment = isShop;
    productComment.commentValue = commentValue;

    productDao.findOneById(Constant.TABLE_NAME_DB.SHOP_PRODUCT.NAME_FIELD_ID, productID).then(function(dataProduct){
        if(dataProduct.length > 0){
            if(productComment.parent_CommentID == 0){
                if(commentType != Constant.COMMENT_TYPE.IMAGE){
                    addNewProductComment(req,res, responseObj, productComment);
                }else{
                    //upload image
                    addNewCommentImage(req,res, responseObj, productComment);
                }
            }else {
                productCommentDao.findOneById(Constant.TABLE_NAME_DB.SHOP_PRODUCT_COMMENTS.NAME_FIELD_ID, commentParentID).then(function (dataParent) {
                    if (dataParent.length > 0) {
                        if (commentType != Constant.COMMENT_TYPE.IMAGE) {
                            addNewProductComment(req, res, responseObj, productComment);
                        } else {
                            //upload image
                            addNewCommentImage(req, res, responseObj, productComment);
                        }
                    } else {
                        responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.PRODUCT_COMMENT_PARENT_INVALID;
                        responseObj.errorsObject = message.PRODUCT_COMMENT.PRODUCT_COMMENT_PARENT_INVALID;
                        responseObj.errorsMessage = message.PRODUCT_COMMENT.PRODUCT_COMMENT_PARENT_INVALID.message;
                        res.send(responseObj);
                    }
                }, function (err) {
                    responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                    responseObj.errorsObject = err;
                    responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                    res.send(responseObj);
                });
            }
        }else{
            responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT.PRODUCT_INVALID;
            responseObj.errorsObject = message.PRODUCT.PRODUCT_INVALID;
            responseObj.errorsMessage = message.PRODUCT.PRODUCT_INVALID.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var editComment = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var commentID = isNaN(req.body.commentID) || !req.body.commentID ? 0 : parseInt(req.body.commentID);

    productCommentDao.findOneById(Constant.TABLE_NAME_DB.SHOP_PRODUCT_COMMENTS.NAME_FIELD_ID, commentID).then(function(dataComment){
        if(dataComment.length > 0){
            if(dataComment[0].userID != userID){
                responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.EDIT_COMMENT_PERMISSION_DENIED;
                responseObj.errorsObject = message.PRODUCT_COMMENT.EDIT_COMMENT_PERMISSION_DENIED;
                responseObj.errorsMessage = message.PRODUCT_COMMENT.EDIT_COMMENT_PERMISSION_DENIED.message;
                res.send(responseObj);
            }else {
                if(dataComment[0].commentType != Constant.COMMENT_TYPE.TEXT){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.EDIT_COMMENT_TYPE_NOT_TEXT;
                    responseObj.errorsObject = message.PRODUCT_COMMENT.EDIT_COMMENT_TYPE_NOT_TEXT;
                    responseObj.errorsMessage = message.PRODUCT_COMMENT.EDIT_COMMENT_TYPE_NOT_TEXT.message;
                    res.send(responseObj);
                }else {
                    var commentValue = req.body.commentValue ? req.body.commentValue : "";

                    productCommentDao.update({commentValue: commentValue}, Constant.TABLE_NAME_DB.SHOP_PRODUCT_COMMENTS.NAME_FIELD_ID, dataComment[0].commentID).then(function (data) {
                        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                        responseObj.results = data;
                        res.send(responseObj);
                    }, function (err) {
                        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                        responseObj.errorsObject = err;
                        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                        res.send(responseObj);
                    });
                }
            }
        }else{
            responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.PRODUCT_COMMENT_INVALID;
            responseObj.errorsObject = message.PRODUCT_COMMENT.PRODUCT_COMMENT_INVALID;
            responseObj.errorsMessage = message.PRODUCT_COMMENT.PRODUCT_COMMENT_INVALID.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

//Check permission delete (shop or owner)
var checkIsShop = function(userId, productId){

}

var deleteComment = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var commentID = isNaN(req.body.commentID) || !req.body.commentID ? 0 : parseInt(req.body.commentID);

    var actionDelete = function(commentIdResuld){
        productCommentDao.update({isActive : 0}, Constant.TABLE_NAME_DB.SHOP_PRODUCT_COMMENTS.NAME_FIELD_ID, commentIdResuld).then(function (data) {
            responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
            responseObj.results = data;
            res.send(responseObj);
        }, function (err) {
            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
            res.send(responseObj);
        });
    }

    productCommentDao.findOneById(Constant.TABLE_NAME_DB.SHOP_PRODUCT_COMMENTS.NAME_FIELD_ID, commentID).then(function(dataComment){
        if(dataComment.length > 0){
            if(dataComment[0].userID != userID){
                productCommentDao.checkIsShopCommentProduct(userID, dataComment[0].productID).then(function (dataCheck) {
                    if(dataCheck.length > 0) {
                        actionDelete(dataComment[0].commentID);
                    }else{
                        responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.DELETE_COMMENT_PERMISSION_DENIED;
                        responseObj.errorsObject = message.PRODUCT_COMMENT.DELETE_COMMENT_PERMISSION_DENIED;
                        responseObj.errorsMessage = message.PRODUCT_COMMENT.DELETE_COMMENT_PERMISSION_DENIED.message;
                        res.send(responseObj);
                    }
                }, function (err) {
                    responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                    responseObj.errorsObject = err;
                    responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                    res.send(responseObj);
                });
            }else {
                actionDelete(dataComment[0].commentID);
            }
        }else{
            responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.PRODUCT_COMMENT_INVALID;
            responseObj.errorsObject = message.PRODUCT_COMMENT.PRODUCT_COMMENT_INVALID;
            responseObj.errorsMessage = message.PRODUCT_COMMENT.PRODUCT_COMMENT_INVALID.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var getCommentByProduct = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var productID = isNaN(req.body.productID) || !req.body.productID ? 0 : parseInt(req.body.productID);
    var pageNum = isNaN(req.body.pageNum) || !req.body.pageNum ? 1 : parseInt(req.body.pageNum);
    var perPage = isNaN(req.body.perPage) || !req.body.perPage? 10 : parseInt(req.body.perPage);

    if(productID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT.PRODUCT_INVALID;
        responseObj.errorsObject = message.PRODUCT.PRODUCT_INVALID;
        responseObj.errorsMessage = message.PRODUCT.PRODUCT_INVALID.message;
        res.send(responseObj);
        return;
    }

    productCommentDao.getCommentByProductID(productID, pageNum, perPage).then(function(dataComment){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = dataComment;
        res.send(responseObj);
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var getCommentByParent = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var parentID = isNaN(req.body.parentID) || !req.body.parentID ? 0 : parseInt(req.body.parentID);
    var pageNum = isNaN(req.body.pageNum) || !req.body.pageNum ? 1 : parseInt(req.body.pageNum);
    var perPage = isNaN(req.body.perPage) || !req.body.perPage? 10 : parseInt(req.body.perPage);

    if(parentID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT_COMMENT.PRODUCT_COMMENT_PARENT_INVALID;
        responseObj.errorsObject = message.PRODUCT_COMMENT.PRODUCT_COMMENT_PARENT_INVALID;
        responseObj.errorsMessage = message.PRODUCT_COMMENT.PRODUCT_COMMENT_PARENT_INVALID.message;
        res.send(responseObj);
        return;
    }

    productCommentDao.getCommentByParent(parentID, pageNum, perPage).then(function(dataComment){
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = dataComment;
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
    createComment : createComment,
    editComment : editComment,
    deleteComment : deleteComment,
    getCommentByProduct : getCommentByProduct,
    getCommentByParent : getCommentByParent
}



