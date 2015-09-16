/**
 * Created by LocNT on 7/29/15.
 */

var TABLE_NAME_DB = {
    PERSON : "person",
    USER : {
        NAME : "User",
        NAME_FIELD_ID : "userID"
    },
    USER_CONTACTS : {
        NAME : "User_Contacts",
        NAME_FIELD_ID : "id"
    },
    USER_CONTACT_STATUS : {
        NAME : "User_Contact_Status",
        NAME_FIELD_ID : "statusID"
    },
    NOTIFICATION : {
        NAME : "Notification",
        NAME_FIELD_ID : "id"
    },
    PROVINCE : {
        NAME : "Data_Province",
        NAME_FIELD_ID : "province_id"
    },
    DISTRICT : {
        NAME : "Data_District",
        NAME_FIELD_ID : "district_id",
        NAME_FIELD_PROVINCE_ID : "province_id"
    },
    WARD : {
        NAME : "Data_Ward",
        NAME_FIELD_ID : "ward_id",
        NAME_FIELD_DISTRICT_ID : "district_id"
    },
    USER_DEVICE_TOKEN : "User_Device_Token",
    USER_ACCESS_TOKEN : "User_Access_Token"
}

var UPLOAD_FILE_CONFIG = {
    MAX_SIZE_IMAGE : {
        IMAGE : 3145728,//3Mb
        USER_AVATAR : 3145728,//3Mb
        USER_COVER : 5242880,//5Mb
    },
    UPLOAD_FOLDER : "uploads",
    PRE_FORDER_IMAGE : {
        IMAGE : "/Images/Demo/",
        USER_AVATAR : "/Images/User/Avatars/",
        USER_COVER : "/Images/User/Covers/",
    }
}

var CODE_STATUS = {
    SUCCESS : 0,
    FAIL : 1,
    DB_EXECUTE_ERROR : 2,
    ACCESS_TOKEN_INVALID : 3,

    USER_REGISTER : {
        USER_EMAIL_EXISTED: 1001,
        USER_REGISTER_PARAMS_EMPTY: 1002,
        USER_REGISTER_INVALID_EMAIL: 1003,
        USER_REGISTER_ERROR_LENGTH_PASSWORD: 1004,
    },
    USER_LOGIN : {
        USER_LOGIN_INCORRECT : 1101,
        USER_LOGIN_EMAIL_FB : 1102,
        USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS : 1103,
        USER_LOGIN_FB_ERROR_EMAIL_NON_FB : 1104,
        USER_LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID : 1105
    },

    USER_CHANGE_PASSWORD : {
        ERROR_CHANGE_WITH_EMAIL_FB : 1201,
        ERROR_OLD_PASSWORD_INCORRECT: 1202
    },

    UPLOAD_FILE : {
        UPLOAD_FAIL : 1301,
        ERROR_EMPTY_FILE : 1302,
        ERROR_LIMITED_SIZE: 1303
    },
    USER_CONTACT : {
        ERROR_USER_NOT_FOUND : 1401,
        ERROR_HAVE_NO_REQUEST_FRIEND : 1402,
        ERROR_ADD_WHEN_ACCEPTED_FRIEND : 1403,
        ERROR_ACCEPT_FRIEND_KEY_EMPTY : 1404,
        ERROR_ACCEPT_FRIEND_KEY_INVALID : 1405,
        ERROR_REQUEST_FRIENDED : 1406
    }
}

var USER_STATUS_VALUE = {
    NEW : "NEW",
    BLOCK : "BLOCK",
    ACTIVE : "ACTIVE"
}

var NOTIFICATION_TYPE = {
    USER_CONTACT : "USER_CONTACT"
}

var USER_FB_AVATAR_LINK = "https://graph.facebook.com/#fbID/picture?type=large";

var USER_CONTACT_STATUS_VALUE = {
    REQUEST_MAKE_FRIEND : "REQUEST_MAKE_FRIEND",
    WATTING_FOR_ACCEPT_REQUEST : "WATTING_FOR_ACCEPT_REQUEST",
    DENY_MAKE_FRIEND_REQUEST : "DENY_MAKE_FRIEND_REQUEST",
    FRIEND : "FRIEND",
    BLOCK_USER_CONTACT : "BLOCK_USER_CONTACT",
    DENIED_MAKE_FRIEND_REQUEST : "DENIED_MAKE_FRIEND_REQUEST",
    BLOCKED_BY_USER : "BLOCKED_BY_USER",
    ALL : "ALL"
}

var USER_CONTACT_PARAM_KEY = {
    ACCEPT : "ACCEPT",
    BLOCK : "BLOCK",
    DENY : "DENY",
    REMOVE : "REMOVE"
}

/*Exports*/
module.exports = {
    UPLOAD_FILE_CONFIG : UPLOAD_FILE_CONFIG,
    TABLE_NAME_DB : TABLE_NAME_DB,
    CODE_STATUS : CODE_STATUS,
    USER_STATUS_VALUE : USER_STATUS_VALUE,
    USER_FB_AVATAR_LINK : USER_FB_AVATAR_LINK,
    USER_CONTACT_STATUS_VALUE : USER_CONTACT_STATUS_VALUE,
    USER_CONTACT_PARAM_KEY : USER_CONTACT_PARAM_KEY,
    NOTIFICATION_TYPE : NOTIFICATION_TYPE
}