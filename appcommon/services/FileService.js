/**
 * Created by LocNT on 7/29/15.
 */

var Q = require("q");
var multiparty = require('multiparty');
var fs = require('fs');
var path = require("path");
var mkdirp = require("mkdirp");

var Constant = require("../helpers/Constant");
var uploadFileHelper = require("../helpers/UploadFileHelper");
var productImageDao = require("../daos/ProductImageDao");

function uploadFile(req, res) {

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(err){
            res.send(err);
            return;
        }
        if(files.imageFile.length == 0|| files.imageFile[0].size == 0){
            res.send({'errcode' : "EMPTY"});
            return;
        }
        if(files.imageFile[0].size > Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.IMAGE){
            res.send({'errcode' : "LIMITED"});
            return;
        }

        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, "Demo",files.imageFile[0].path, Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.IMAGE).then(function(fullFilePath){
            res.send({'path' : fullFilePath});
            return;
        },function(err){
            res.send(err);
            return;
        });
    });
}

function viewFile(req, res, preFolder) {
    var file = req.params.file;
    var fullFile = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + preFolder + file;
    fs.stat(fullFile, function(err){
        if(!err){
            res.sendFile(path.resolve(fullFile));
        }else{
            res.writeHead(404);
            res.end();
        }
    });
}

function viewProductImageFile(req, res) {
    var file = req.params.file;
    var productID = req.query.productID ? req.query.productID : 0;

    var fullFile = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.PRODUCT_IMAGE + productID + "/" + file;
    fs.stat(fullFile, function(err){
        if(!err){
            res.sendFile(path.resolve(fullFile));
        }else{
            res.writeHead(404);
            res.end();
        }
    });
}

function viewImageAvatarProduct (req, res){
    var productID = req.query.productID ? req.query.productID : 0;



    productImageDao.getAllImageByProduct(productID).then(function(data){
        if(data.length == 0){
            res.writeHead(404);
            res.end();
        }else{
            var file = data[0].imageURLFull;
            var fullFile = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.PRODUCT_IMAGE + productID + "/" + file;
            //var fullFile = "/Users/ChungTV/WebstormProjects/ChoVietMoiService/app.js";

            fs.stat(fullFile, function(err){

                if(!err){
                    res.sendFile(path.resolve(fullFile));
                }else{
                    res.writeHead(404);
                    res.end();
                }
            })
        }
    }, function(err){
        res.writeHead(404);
        res.end();
    });
}

function viewCommentImageFile(req, res) {
    var file = req.params.file;
    var productID = req.query.productID ? req.query.productID : 0;

    var fullFile = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.PRODUCT_IMAGE + productID + Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.SUB_COMMENT_IMAGE + file;
    fs.stat(fullFile, function(err){
        if(!err){
            res.sendFile(path.resolve(fullFile));
        }else{
            res.writeHead(404);
            res.end();
        }
    });
}

function createFolderIfNotExits(folder_path){
    fs.stat(folder_path, function(err){
        if(err){
            mkdirp(path.resolve(folder_path), function (err) {
                if (err) {
                    console.error("Create folder " + folder_path + " error : " + err);
                }else{
                    console.log("Create folder " + folder_path + " success");
                }
            });
        }
    });
}

/*Exports*/
module.exports = {
    uploadFile : uploadFile,
    viewFile : viewFile,
    viewProductImageFile : viewProductImageFile,
    createFolderIfNotExits : createFolderIfNotExits,
    viewImageAvatarProduct : viewImageAvatarProduct,
    viewCommentImageFile : viewCommentImageFile

}