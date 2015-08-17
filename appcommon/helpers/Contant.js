/**
 * Created by LocNT on 7/29/15.
 */

var TABLE_NAME_DB = {
    PERSON : "person",
    USER : "User",
    USER_DEVICE_TOKEN : "User_Device_Token",
    USER_ACCESS_TOKEN : "User_Access_Token"
}

var UPLOAD_FILE_CONFIG = {
    MAX_SIZE_IMAGE : 3145728, //3Mb
    UPLOAD_FOLDER : "uploads",
    PRE_FORDER_IMAGE : "/BackgroundStore/Images/"
}

var CODE_STATUS = {
    SUCCESS : 0,
    FAIL : 1,
    DB_EXECUTE_ERROR : 2,

    USER_REGISTER : {
        USER_EMAIL_EXISTED: 101,
        USER_REGISTER_PARAMS_EMPTY: 102,
        USER_REGISTER_INVALID_EMAIL: 103,
        USER_REGISTER_ERROR_LENGTH_PASSWORD: 104,
    },
    USER_LOGIN : {
        USER_LOGIN_INCORRECT : 201,
        USER_LOGIN_EMAIL_FB : 202,
        USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS : 203,
        USER_LOGIN_FB_ERROR_EMAIL_NON_FB : 204,
        USER_LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID : 205
    }
}

var USER_STATUS_VALUE = {
    NEW : "NEW"
}

var USER_FB_AVATAR_LINK = "https://graph.facebook.com/#fbID/picture?type=small";

/*Exports*/

module.exports = {
    UPLOAD_FILE_CONFIG : UPLOAD_FILE_CONFIG,
    TABLE_NAME_DB : TABLE_NAME_DB,
    CODE_STATUS : CODE_STATUS,
    USER_STATUS_VALUE : USER_STATUS_VALUE,
    USER_FB_AVATAR_LINK : USER_FB_AVATAR_LINK
}