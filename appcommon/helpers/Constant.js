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
    SHOP_TYPE_CHILD : {
        NAME : "Data_List_Shop_Type_Child",
        NAME_FIELD_ID : "shopTypeChildID",
        NAME_FIELD_PARENT_ID : "shopTypeParentID"
    },
    SHOP_TYPE_PARENT : {
        NAME : "Data_List_Shop_Type_Parent",
        NAME_FIELD_ID : "shopTypeParentID"
    },
    SHOP : {
        NAME : "Shop",
        NAME_FIELD_ID : "shopID"
    },
    SHOP_TYPE : {
        NAME : "Shop_Type",
        NAME_FIELD_ID : "id"
    },
    SHOP_DISTRICT : {
        NAME : "Shop_District",
        NAME_FIELD_ID : "id"
    },
    SHOP_ADDRESS : {
        NAME : "Shop_Address",
        NAME_FIELD_ID : "id"
    },
    SHOP_CATEGORY : {
        NAME : "Shop_Categories",
        NAME_FIELD_ID : "categoryID"
    },
    SHOP_PRODUCT : {
        NAME : "Shop_Product",
        NAME_FIELD_ID : "productID"
    },
    SHOP_PRODUCT_IMAGE : {
        NAME : "Shop_Product_Images",
        NAME_FIELD_ID : "id"
    },
    SHOP_PRODUCT_COMMENTS : {
        NAME : "Shop_Product_Comments",
        NAME_FIELD_ID : "commentID"
    },
    USER_FAVORITE_ITEMS : {
        NAME : "User_Favorite_Items",
        NAME_FIELD_ID : "id"
    },
    USER_DEVICE_TOKEN : "User_Device_Token",
    USER_ACCESS_TOKEN : "User_Access_Token"
}

var PRE_PATH_SYSTEM_PRO = "/home/develop/deploys/ChoVietMoiService/";
var PRE_PATH_SYSTEM_DEV = "/home/develop/deploys/ChomoiTest/ChoVietMoiService/";

var UPLOAD_FILE_CONFIG = {
    MAX_SIZE_IMAGE : {
        IMAGE : 3145728,//3Mb
        USER_AVATAR : 3145728,//3Mb
        USER_COVER : 5242880,//5Mb
        SHOP_AVATAR : 3145728,//3Mb
        SHOP_COVER : 5242880,//5Mb
        CATEGORY_COVER : 5242880,//5Mb
        PRODUCT_IMAGE : 5242880
    },
    UPLOAD_FOLDER : "uploads",
    PRE_FOLDER_IMAGE : {
        IMAGE : "/Images/Demo/",
        USER_AVATAR : "/Images/User/Avatars/",
        USER_COVER : "/Images/User/Covers/",
        SHOP_AVATAR : "/Images/Shop/Avatars/",
        SHOP_COVER : "/Images/Shop/Covers/",
        CATEGORY_COVER : "/Images/Category/Covers/",
        PRODUCT_IMAGE : "/Images/Product/",
        SUB_COMMENT_IMAGE : "/Comment/"
    }
}

var COMMENT_TYPE = {
    TEXT : "TEXT",
    SHOP : "SHOP",
    PRODUCT : "PRODUCT",
    IMAGE : "IMAGE"
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
    },
    SHOP : {
        CREATE_SHOP_EMPTY_FIELD: 1501,
        CREATE_SHOP_NAME_OF_USER_EXIST : 1502,
        SHOP_INVALID : 1503,
        SHOP_ACTION_INVALID : 1504,
        SHOP_UPDATE_USER_IS_DENIED : 1505
    },
    CATEGORY : {
        CREATE_CATEGORY_EMPTY_FIELD: 1601,
        CREATE_CATEGORY_NAME_OF_SHOP_EXIST : 1602,
        CATEGORY_INVALID : 1603,
        CATEGORY_UPDATE_USER_IS_DENIED : 1605
    },
    PRODUCT : {
        CREATE_PRODUCT_EMPTY_FIELD: 1701,
        CREATE_PRODUCT_NAME_OF_CATEGORY_EXIST : 1702,
        PRODUCT_INVALID : 1703,
        PRODUCT_IMAGE_INVALID : 1704,
        CREATE_PRODUCT_CODE_EXIST : 1705
    },
    ADDRESS : {
        CREATE_SHOP_ADDRESS_EMPTY_FIELD: 1801,
        SHOP_ADDRESS_INVALID : 1802
    },
    USER_FAVORITE : {
        EXECUTE_ERROR_ACTION: 1901,
        EXECUTE_ERROR_TYPE_ITEM : 1902,
        ITEM_INVALID : 1903,
        ADD_ITEM_EXISTED : 1904,
        REMOVE_ITEM_NOT_EXISTED : 1905
    },
    PRODUCT_COMMENT : {
        PRODUCT_COMMENT_INVALID : 2001,
        PRODUCT_COMMENT_PARENT_INVALID : 2002,
        EDIT_COMMENT_PERMISSION_DENIED : 2003,
        DELETE_COMMENT_PERMISSION_DENIED : 2004,
        EDIT_COMMENT_TYPE_NOT_TEXT : 2005
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

var SHOP_STATUS_VALUE = {
    ACTIVE : "ACTIVE",
    BLOCK : "BLOCK"
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
    NOTIFICATION_TYPE : NOTIFICATION_TYPE,
    SHOP_STATUS_VALUE : SHOP_STATUS_VALUE,
    COMMENT_TYPE : COMMENT_TYPE
}