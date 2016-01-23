/**
 * Created by LocNT on 7/29/15.
 */
var MD5 = require("MD5");
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
var multiparty = require('multiparty');

//var MysqlHelperModule = require("../helpers/MysqlHelper");
var userDao = require("../daos/UserDao");
var accessTokenDao = require("../daos/AccessTokenDao");

var User = require("../models/User");

var UserDeviceToken = require("../models/UserDeviceToken");
var UserAccessToken = require("../models/UserAccessToken");
var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var UserLoginDto = require("../modelsDto/UserLoginDto");
var UserUpdateDTO = require("../modelsDto/UserUpdateDTO");
var UploadResponseDTO = require("../modelsDto/UploadResponseDTO");

var Constant = require("../helpers/Constant");
var message = require("../message/en");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");
var uploadFileHelper = require("../helpers/UploadFileHelper");

var ID_FIELD_NAME = Constant.TABLE_NAME_DB.USER.NAME_FIELD_ID;

var registerByEmail = function(req, res){
    var responseObj = new ResponseServerDto();
    var email = req.body.email ? req.body.email : "";
    var password = req.body.password ? req.body.password : "";
    var fullname = req.body.fullname ? req.body.fullname : "";

    if(checkValidateUtil.isEmptyFeild(email) || checkValidateUtil.isEmptyFeild(password) || checkValidateUtil.isEmptyFeild(fullname)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY;
        responseObj.errorsObject = message.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY;
        responseObj.errorsMessage = message.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY.message;
        res.send(responseObj);
        return;
    }

    if(!checkValidateUtil.checkValidateEmail(email)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER.USER_REGISTER_INVALID_EMAIL;
        responseObj.errorsObject = message.USER_REGISTER.USER_REGISTER_INVALID_EMAIL;
        responseObj.errorsMessage = message.USER_REGISTER.USER_REGISTER_INVALID_EMAIL.message;
        res.send(responseObj);
        return;
    }

    /*if(!checkValidateUtil.checkLengthPassword(password)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER.USER_REGISTER_ERROR_LENGTH_PASSWORD;
        responseObj.errorsObject = message.USER_REGISTER.USER_REGISTER_ERROR_LENGTH_PASSWORD;
        responseObj.errorsMessage = message.USER_REGISTER.USER_REGISTER_ERROR_LENGTH_PASSWORD.message;
        res.send(responseObj);
        return;
    }*/

    userDao.checkEmailExist(email).then(function(data){
        if(data.length == 0){
            userDao.getUserStatusByValue(Constant.USER_STATUS_VALUE.ACTIVE).then(function(status){
                var userStatusId = 0;
                if(status.length > 0){
                    userStatusId = status[0].userStatusID;
                }
                var user = new User();
                user.email = email;
                user.fullName = fullname;
                user.passWord = MD5(password);
                user.userStatusID = userStatusId;
                user.isActive = true;

                userDao.addNew(user).then(function(result){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                    responseObj.results = result;
                    res.send(responseObj);
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
            responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER.USER_EMAIL_EXISTED;
            responseObj.errorsObject = message.USER_REGISTER.USER_EMAIL_EXISTED;
            responseObj.errorsMessage = message.USER_REGISTER.USER_EMAIL_EXISTED.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var addTokenAccess = function(userId, accessToken, deviceTokenID){
    var accessTokenObj = new UserAccessToken();
    accessTokenObj.userID = userId;
    accessTokenObj.accessTokenValue = accessToken;
    accessTokenObj.deviceTokenID = deviceTokenID;

    userDao.addNewCustom(Constant.TABLE_NAME_DB.USER_ACCESS_TOKEN, accessTokenObj).then(function(result){
        console.log("save user access token success : " + JSON.stringify(result));
    },function(err){
        console.log("save user access token error : " + JSON.stringify(err));
    });
};

var loginByEmail = function(req, res){
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";
    var password = req.body.password ? req.body.password : "";
    var deviceToken = req.body.deviceToken ? req.body.deviceToken : "";

    if(checkValidateUtil.isEmptyFeild(deviceToken)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY;
        responseObj.errorsObject = message.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY;
        responseObj.errorsMessage = message.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY.message;
        res.send(responseObj);
        return;
    }

    userDao.checkLogin(email, MD5(password)).then(function(data){
        if(data.length > 0){
            var userObj = data[0];
            if(userObj.isFacebookAccount){
                responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_EMAIL_FB;
                responseObj.errorsObject = message.USER_LOGIN.USER_LOGIN_EMAIL_FB;
                responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_EMAIL_FB.message;
                res.send(responseObj);
            }else{
                //generate accesstoken
                var accessToken = serviceUtil.generateAccessToken();
                console.log("accesstoken : " +  accessToken);

                var userLoginDto = new UserLoginDto();
                userObj.passWord = "******";
                userLoginDto.user = userObj;
                userLoginDto.accessToken = accessToken;

                responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                responseObj.results = userLoginDto;
                res.send(responseObj);

                //Save Device Token
                var userDeviceToken = new UserDeviceToken();
                userDeviceToken.deviceTokenValue = deviceToken;
                userDao.findDeviceTokenByValue(deviceToken).then(function(data){
                    var deviceTokenId = 0;
                    if(data.length ==0){
                        userDao.addNewCustom(Constant.TABLE_NAME_DB.USER_DEVICE_TOKEN, userDeviceToken).then(function(result){
                            console.log("save user device token success : " + JSON.stringify(result));
                            deviceTokenId = result.insertId;
                            addTokenAccess(userObj.userID, accessToken, deviceTokenId);
                        },function(err){
                            console.log("save user device token error : " + JSON.stringify(err));
                        });
                    }else{
                        deviceTokenId = data[0].deviceTokenID;
                        addTokenAccess(userObj.userID, accessToken, deviceTokenId);
                    }
                },function(err){
                    console.log("find user device token error : " + JSON.stringify(err));
                });
            }
        }else{
            responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_INCORRECT;
            responseObj.errorsObject = message.USER_LOGIN.USER_LOGIN_INCORRECT;
            responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_INCORRECT.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

//add device token and create access token with login fb
var addTokenWithLoginFb = function(deviceToken, accessToken, userID){
    //Save Device Token
    var userDeviceToken = new UserDeviceToken();
    userDeviceToken.deviceTokenValue = deviceToken;
    userDao.findDeviceTokenByValue(deviceToken).then(function(data){
        var deviceTokenId = 0;
        if(data.length ==0){
            userDao.addNewCustom(Constant.TABLE_NAME_DB.USER_DEVICE_TOKEN, userDeviceToken).then(function(result){
                console.log("save user device token success : " + JSON.stringify(result));
                deviceTokenId = result.insertId;
                addTokenAccess(userID, accessToken, deviceTokenId);
            },function(err){
                console.log("save user device token error : " + JSON.stringify(err));
            });
        }else{
            deviceTokenId = data[0].deviceTokenID;
            addTokenAccess(userID, accessToken, deviceTokenId);
        }
    },function(err){
        console.log("find user device token error : " + JSON.stringify(err));
    });
}

var loginByFb = function(req, res){
    var responseObj = new ResponseServerDto();

    var fbAccessToken = req.body.fbAccessToken ? req.body.fbAccessToken : "";
    var deviceToken = req.body.deviceToken ? req.body.deviceToken : "";

    if(checkValidateUtil.isEmptyFeild(deviceToken)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER_PARAMS_EMPTY;
        responseObj.errorsObject = message.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY;
        responseObj.errorsMessage = message.USER_REGISTER.USER_REGISTER_PARAMS_EMPTY.message;
        res.send(responseObj);
        return;
    }

    var optionsget = {
        host : 'graph.facebook.com', // here only the domain name
        port : 443,
        path : '/me?access_token=' + fbAccessToken, // the rest of the url with parameters if needed
        method : 'GET', // do GET
        headers : {
            'Content-Type' : 'application/json'
        }
    };

    // do the GET request
    var reqGet = https.request(optionsget, function(response) {
        var decoder = new StringDecoder('utf8');
        response.on('data', function(data) {
            var text = decoder.write(data);
            var jsonObj = {};
            try {
                jsonObj = JSON.parse(text);
            }catch(e){
                responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
                responseObj.errorsObject = e;
                responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message;
                res.send(responseObj);
                return;
            }

            //response error
            if(jsonObj.error){
                responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
                responseObj.errorsObject = jsonObj.error;
                responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message;
                res.send(responseObj);
                return;
            }

            //response varified == false
            //if(!jsonObj.verified){
            //    responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID;
            //    responseObj.errorsObject = message.USER_LOGIN.USER_LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID;
            //    responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID.message;
            //    res.send(responseObj);
            //    return;
            //}

            var accessToken = serviceUtil.generateAccessToken();
            console.log("accesstoken : " +  accessToken);

            var email = jsonObj.email;
            userDao.checkEmailExist(email).then(function(data){
                if(data.length == 0){
                    userDao.findDeviceTokenByValue(Constant.USER_STATUS_VALUE.ACTIVE).then(function(status){
                        var userStatusId = 0;
                        if(status.length > 0){
                            userStatusId = status[0].userStatusID;
                        }
                        var user = new User();
                        user.email = email;
                        user.fullName = jsonObj.name;
                        user.dateOfBirth = jsonObj.birthday;
                        user.passWord = "******";
                        user.gender = jsonObj.gender.toUpperCase();
                        user.isFacebookAccount = true;
                        user.userStatusID = userStatusId;
                        user.avatarImageURL = Constant.USER_FB_AVATAR_LINK.replace("#fbID", jsonObj.id);
                        user.isActive = true;

                        userDao.addNew(user).then(function(result){
                            var userLoginDto = new UserLoginDto();
                            user.userID = result.insertId;

                            //add statusValue
                            user.statusValue = Constant.USER_STATUS_VALUE.ACTIVE;

                            userLoginDto.user = user;
                            userLoginDto.accessToken = accessToken;

                            responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                            responseObj.results = userLoginDto;
                            res.send(responseObj);

                            addTokenWithLoginFb(deviceToken, accessToken, result.insertId);
                        },function(err){
                            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                            responseObj.errorsObject = err;
                            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                            console.log(responseObj);
                        });
                    },function(err){
                        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                        responseObj.errorsObject = err;
                        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                        console.log(responseObj);
                    });
                }else{
                    var user = data[0];
                    if(!user.isFacebookAccount) {
                        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_FB_ERROR_EMAIL_NON_FB;
                        responseObj.errorsObject = message.USER_LOGIN.USER_LOGIN_FB_ERROR_EMAIL_NON_FB;
                        responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_FB_ERROR_EMAIL_NON_FB.message;
                        res.send(responseObj);
                        return;
                    }else{
                        var userLoginDto = new UserLoginDto();
                        user.passWord = "******";
                        userLoginDto.user = user;
                        userLoginDto.accessToken = accessToken;

                        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                        responseObj.results = userLoginDto;
                        res.send(responseObj);

                        addTokenWithLoginFb(deviceToken, accessToken, user.userID);
                    }
                }
            }, function(err){
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                console.log(responseObj);
            });

        });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.USER_LOGIN.USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
        responseObj.errorsObject = e;
        responseObj.errorsMessage = message.USER_LOGIN.USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message;
        res.send(responseObj);
    });

};

var logout = function(req, res){
    var responseObj = new ResponseServerDto();
    var accessTokenObj = req.accessTokenObj;

    if(!accessTokenObj){
        responseObj.statusErrorCode = Constant.CODE_STATUS.ACCESS_TOKEN_INVALID;
        responseObj.errorsObject = message.ACCESS_TOKEN_INVALID;
        responseObj.errorsMessage = message.ACCESS_TOKEN_INVALID.message;
        res.send(responseObj);
    }else{
        var accessTokenId = accessTokenObj.id;
        accessTokenDao.remove("id", accessTokenId).then(function(result){
            responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
            responseObj.results = result;
            res.send(responseObj);
        },function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
            res.send(responseObj);
        });
    }
};

var changePassword = function(req, res){
    var responseObj = new ResponseServerDto();
    var accessTokenObj = req.accessTokenObj;

    if(!accessTokenObj){
        responseObj.statusErrorCode = Constant.CODE_STATUS.ACCESS_TOKEN_INVALID;
        responseObj.errorsObject = message.ACCESS_TOKEN_INVALID;
        responseObj.errorsMessage = message.ACCESS_TOKEN_INVALID.message;
        res.send(responseObj);
    }else{
        if(accessTokenObj.isFacebookAccount){
            responseObj.statusErrorCode = Constant.CODE_STATUS.USER_CHANGE_PASSWORD.ERROR_CHANGE_WITH_EMAIL_FB;
            responseObj.errorsObject = message.USER_CHANGE_PASSWORD.ERROR_CHANGE_WITH_EMAIL_FB;
            responseObj.errorsMessage = message.USER_CHANGE_PASSWORD.ERROR_CHANGE_WITH_EMAIL_FB.message;
            res.send(responseObj);
            return;
        }

        var oldPassword = req.body.oldPassword ? req.body.oldPassword : "";
        var newPassword = req.body.newPassword ? req.body.newPassword : "";

        /*if(!checkValidateUtil.checkLengthPassword(newPassword)){
            responseObj.statusErrorCode = Constant.CODE_STATUS.USER_REGISTER.USER_REGISTER_ERROR_LENGTH_PASSWORD;
            responseObj.errorsObject = message.USER_REGISTER.USER_REGISTER_ERROR_LENGTH_PASSWORD;
            responseObj.errorsMessage = message.USER_REGISTER.USER_REGISTER_ERROR_LENGTH_PASSWORD.message;
            res.send(responseObj);
            return;
        }*/

        var email = accessTokenObj.email;
        userDao.checkLogin(email, MD5(oldPassword)).then(function(data){
            if(data.length > 0){
                var userID = data[0].userID;

                userDao.changePassword(userID, MD5(newPassword)).then(function(result){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                    responseObj.results = result;
                    res.send(responseObj);

                    //remove all other access_token
                    var accesTkValue = accessTokenObj.accessTokenValue;

                    accessTokenDao.removeAllOtherAccessTokenByUserId(accesTkValue, userID).then(function(result){
                        console.log("removeAllOtherAccessTokenByUserId success");
                    },function(err){
                        console.log("removeAllOtherAccessTokenByUserId error");
                    });

                },function(err){
                    responseObj.statusErrorCode = Constant.CODE_STATUS.USER_CHANGE_PASSWORD.ERROR_OLD_PASSWORD_INCORRECT;
                    responseObj.errorsObject = message.USER_CHANGE_PASSWORD.ERROR_OLD_PASSWORD_INCORRECT;
                    responseObj.errorsMessage = message.USER_CHANGE_PASSWORD.ERROR_OLD_PASSWORD_INCORRECT.message;
                    res.send(responseObj);
                });
            }else{
                responseObj.statusErrorCode = Constant.CODE_STATUS.USER_CHANGE_PASSWORD.ERROR_OLD_PASSWORD_INCORRECT;
                responseObj.errorsObject = message.USER_CHANGE_PASSWORD.ERROR_OLD_PASSWORD_INCORRECT;
                responseObj.errorsMessage = message.USER_CHANGE_PASSWORD.ERROR_OLD_PASSWORD_INCORRECT.message;
                res.send(responseObj);
            }
        }, function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
            res.send(responseObj);
        });
    }
};

var getUserProfile = function(req, res){
    var responseObj = new ResponseServerDto();
    var accessTokenObj = req.accessTokenObj;

    if(!accessTokenObj){
        responseObj.statusErrorCode = Constant.CODE_STATUS.ACCESS_TOKEN_INVALID;
        responseObj.errorsObject = message.ACCESS_TOKEN_INVALID;
        responseObj.errorsMessage = message.ACCESS_TOKEN_INVALID.message;
        res.send(responseObj);
    }else{

        var userID = accessTokenObj.userID;
        userDao.getUserProfileById(userID).then(function(data){
            if(data.length > 0){
                data[0].passWord = "******";
            }
            responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
            responseObj.results = data;
            res.send(responseObj);
        }, function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
            res.send(responseObj);
        });
    }
};

var updateUserProfile = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth : "0000-00-00 00:00:00";
    var iShowEmail = req.body.iShowEmail ? req.body.iShowEmail : false;
    var fullname = req.body.fullname ? req.body.fullname : "";
    var phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : "";
    var isShowPhoneNumber = req.body.isShowPhoneNumber ? req.body.isShowPhoneNumber : "";
    var gender = req.body.gender ? req.body.gender : "";

    if(!accessTokenObj){
        responseObj.statusErrorCode = Constant.CODE_STATUS.ACCESS_TOKEN_INVALID;
        responseObj.errorsObject = message.ACCESS_TOKEN_INVALID;
        responseObj.errorsMessage = message.ACCESS_TOKEN_INVALID.message;
        res.send(responseObj);
    }else {
        var userID = accessTokenObj.userID;
        var userUpdateDTO = new UserUpdateDTO();
        userUpdateDTO.dateOfBirth = dateOfBirth;
        userUpdateDTO.iShowEmail = iShowEmail;
        userUpdateDTO.fullName = fullname;
        userUpdateDTO.phoneNumber = phoneNumber;
        userUpdateDTO.isShowPhoneNumber = isShowPhoneNumber;
        userUpdateDTO.gender = gender;

        userDao.update(userUpdateDTO, ID_FIELD_NAME, userID).then(function (result) {
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
};

//upload avatar
function updateAvatar(req, res) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var fileNamePre = "User_avatar_" + userID;

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
        if(files.imageFile[0].size > Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.USER_AVATAR){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsObject = message.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsMessage = message.UPLOAD_FILE.ERROR_LIMITED_SIZE.message;
            res.send(responseObj);
            return;
        }

        var uploadResponseDTO = new UploadResponseDTO();

        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, fileNamePre,files.imageFile[0].path, Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.USER_AVATAR).then(function(fullFilePath){
            var uploadResponseDTO = new UploadResponseDTO();
            uploadResponseDTO.file = fullFilePath;

            userDao.update({"avatarImageURL" : fullFilePath}, ID_FIELD_NAME, userID).then(function (result) {
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
function updateCover(req, res) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var fileNamePre = "User_cover_" + userID;

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
        if(files.imageFile[0].size > Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.USER_COVER){
            responseObj.statusErrorCode = Constant.CODE_STATUS.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsObject = message.UPLOAD_FILE.ERROR_LIMITED_SIZE;
            responseObj.errorsMessage = message.UPLOAD_FILE.ERROR_LIMITED_SIZE.message;
            res.send(responseObj);
            return;
        }

        var uploadResponseDTO = new UploadResponseDTO();

        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, fileNamePre,files.imageFile[0].path, Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.USER_COVER).then(function(fullFilePath){
            var uploadResponseDTO = new UploadResponseDTO();
            uploadResponseDTO.file = fullFilePath;

            userDao.update({"coverImageURL" : fullFilePath}, ID_FIELD_NAME, userID).then(function (result) {
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

//searchUser
var searchUser = function(req, res){
    var responseObj = new ResponseServerDto();
    var accessTokenObj = req.accessTokenObj;

    if(!accessTokenObj){
        responseObj.statusErrorCode = Constant.CODE_STATUS.ACCESS_TOKEN_INVALID;
        responseObj.errorsObject = message.ACCESS_TOKEN_INVALID;
        responseObj.errorsMessage = message.ACCESS_TOKEN_INVALID.message;
        res.send(responseObj);
    }else{
        var userID = accessTokenObj.userID;
        var searchText = req.body.searchText;

        var pageNum = isNaN(req.body.pageNum)? 1 : parseInt(req.body.pageNum);
        var perPage = isNaN(req.body.perPage)? 10 : parseInt(req.body.perPage);

        userDao.searchUser(userID, searchText, pageNum, perPage).then(function(data){
            responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
            responseObj.results = data;
            res.send(responseObj);
        }, function(err){
            responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
            responseObj.errorsObject = err;
            responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
            res.send(responseObj);
        });
    }
};

/*Exports*/
module.exports = {
    registerByEmail : registerByEmail,
    loginByEmail : loginByEmail,
    loginByFb : loginByFb,
    logout : logout,
    changePassword : changePassword,
    getUserProfile : getUserProfile,
    updateUserProfile : updateUserProfile,
    updateAvatar : updateAvatar,
    updateCover : updateCover,
    searchUser : searchUser
}