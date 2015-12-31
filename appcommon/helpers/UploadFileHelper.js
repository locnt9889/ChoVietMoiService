/**
 * Created by LocNT on 7/29/15.
 */

var Q = require("q");
var fs = require('fs');
var path = require("path");

var Constant = require("../helpers/Constant");
var ServiceUtil = require("../utils/ServiceUtil");

function writeFileUpload(fileName, newPreFile,filePath, preFolder){
    var deferred = Q.defer();

    //remove white space in filename
    var ext = ServiceUtil.getExtFileByName(fileName);
    fs.readFile(filePath, function (err,data) {
        if (err) {
            deferred.reject(err);
        }else {
            var currentDate = new Date();
            var filepathSave = newPreFile + "_" + currentDate.getTime() + ext;
            var fullFilePath = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + preFolder;

            fs.exists(fullFilePath, function(result){
                if(!result){
                    mkdirp(path.resolve(fullFilePath), function (err) {
                        if (err) {
                            console.error("Create folder " + fullFilePath + " error : " + err);
                        }else{
                            console.log("Create folder " + fullFilePath + " success");
                            console.log("fullFilePath : " + fullFilePath);
                            fs.writeFile(fullFilePath + filepathSave, data, function (err) {
                                if (err) {
                                    deferred.reject(err);
                                }else{
                                    deferred.resolve(filepathSave);
                                }
                            });
                        }
                    });
                }else{
                    console.log("fullFilePath : " + fullFilePath);
                    fs.writeFile(fullFilePath + filepathSave, data, function (err) {
                        if (err) {
                            deferred.reject(err);
                        }else{
                            deferred.resolve(filepathSave);
                        }
                    });
                }
            });

            console.log("fullFilePath : " + fullFilePath);
            //fs.writeFile(fullFilePath + filepathSave, data, function (err) {
            //    if (err) {
            //        deferred.reject(err);
            //    }else{
            //        deferred.resolve(filepathSave);
            //    }
            //});
        }
    });
    return deferred.promise;
}

/*Exports*/
module.exports = {
    writeFileUpload : writeFileUpload

}