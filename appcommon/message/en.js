/**
 * Created by LocNT on 8/16/15.
 */

var SUCCESS = {
    code : 0,
    message : "Successfully!"
}

var FAIL = {
    code : 1,
    message : "Failure!"
}

var DB_EXECUTE_ERROR = {
    code : 2,
    message : "Database query is failure!"
}

var ACCESS_TOKEN_INVALID = {
    code : 3,
    message : "Access token is invalid!"
}

var USER_REGISTER = {
    USER_EMAIL_EXISTED : {
        code: 1001,
        message: "Email has existed!"
    },
    USER_REGISTER_PARAMS_EMPTY : {
        code: 1002,
        message: "Error empty with parameter required!"
    },
    USER_REGISTER_INVALID_EMAIL : {
        code: 1003,
        message: "Email is invalid!"
    },
    USER_REGISTER_ERROR_LENGTH_PASSWORD : {
        code: 1004,
        message: "Password have length between 6 and 20!"
    }
}

var USER_LOGIN = {
    USER_LOGIN_INCORRECT : {
        code : 1101,
        message : "Login is failure, Email or Password is incorrect!"
    },
    USER_LOGIN_EMAIL_FB : {
        code: 1102,
        message: "Login is failure, please login by FB with this email!"
    },
    USER_LOGIN_FB_ERROR_GET_PROFILE_ACCESS : {
        code: 1103,
        message: "Login facebook, get info of access token is failure!"
    },
    USER_LOGIN_FB_ERROR_EMAIL_NON_FB : {
        code: 1104,
        message: "Login facebook, user is not a user fb!"
    },
    USER_LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID : {
        code: 1105,
        message: "Login facebook, access token is invalid!"
    }
}

var USER_CHANGE_PASSWORD = {
    ERROR_CHANGE_WITH_EMAIL_FB : {
        code: 1201,
        message: "Can not change password of FB user!"
    },
    ERROR_OLD_PASSWORD_INCORRECT : {
        code: 1202,
        message: "Old password is incorrect!"
    }
}

var UPLOAD_FILE = {
    UPLOAD_FAIL : {
        code: 1301,
        message: "File upload is failure!"
    },
    ERROR_EMPTY_FILE : {
        code: 1302,
        message: "File upload is empty!"
    },
    ERROR_LIMITED_SIZE: {
        code: 1303,
        message: "File upload is limited size!"
    }
}

var USER_CONTACT = {
    ERROR_USER_NOT_FOUND : {
        code: 1401,
        message: "User is not existed!"
    },
    ERROR_HAVE_NO_REQUEST_FRIEND : {
        code: 1402,
        message: "User don't have request add friend!"
    },
    ERROR_ADD_WHEN_ACCEPTED_FRIEND : {
        code: 1403,
        message: "Can't add a friend!"
    },
    ERROR_ACCEPT_FRIEND_KEY_EMPTY : {
        code: 1404,
        message: "Key is require field!"
    },
    ERROR_ACCEPT_FRIEND_KEY_INVALID : {
        code: 1405,
        message: "Key is invalid!"
    },
    ERROR_REQUEST_FRIENDED : {
        code: 1406,
        message: "Contact existed!"
    }
}

var SHOP = {
    CREATE_SHOP_EMPTY_FIELD: {
        code: 1501,
        message: "Error empty with parameter required!"
    },
    CREATE_SHOP_NAME_OF_USER_EXIST : {
        code: 1502,
        message: "Error create shop name was existed!"
    },
    SHOP_INVALID : {
        code: 1503,
        message: "Shop is invalid"
    },
    SHOP_ACTION_INVALID : {
        code: 1504,
        message: "Action for Shop is invalid"
    },
    SHOP_UPDATE_USER_IS_DENIED : {
        code: 1505,
        message: "User is denied with action update shop!"
    }
}

var CATEGORY = {
    CREATE_CATEGORY_EMPTY_FIELD: {
        code: 1601,
        message: "Error empty with parameter required!"
    },
    CREATE_CATEGORY_NAME_OF_SHOP_EXIST : {
        code: 1602,
        message: "Error create category of shop: name was existed!"
    },
    CATEGORY_INVALID : {
        code: 1603,
        message: "Category is invalid"
    },
    CATEGORY_UPDATE_USER_IS_DENIED : {
        code: 1605,
        message: "User is denied with action update category!"
    }
}

var ADDRESS = {
    CREATE_SHOP_ADDRESS_EMPTY_FIELD: {
        code: 1801,
        message: "Error empty with parameter required!"
    },
    SHOP_ADDRESS_INVALID : {
        code: 1802,
        message: "Shop address is invalid"
    }
}

var PRODUCT = {
    CREATE_PRODUCT_EMPTY_FIELD: {
        code: 1701,
        message: "Error empty with parameter required!"
    },
    CREATE_PRODUCT_NAME_OF_CATEGORY_EXIST : {
        code: 1702,
        message: "Error create product of category: name was existed!"
    },
    PRODUCT_INVALID : {
        code: 1703,
        message: "Product is invalid"
    },
    PRODUCT_INVALID_IMAGE : {
        code: 1704,
        message: "Product image is invalid"
    },
    CREATE_PRODUCT_CODE_EXIST : {
        code: 1705,
        message: "Product code was existed"
    }
}

var USER_FAVORITE = {
    EXECUTE_ERROR_ACTION: {
        code: 1901,
        message: "Action is incorrect!"
    },
    EXECUTE_ERROR_TYPE_ITEM : {
        code: 1902,
        message: "Item Type is incorrect"
    },
    ITEM_INVALID : {
        code: 1903,
        message: "Item is invalid"
    },
    ADD_ITEM_EXISTED : {
        code: 1904,
        message: "Can not add favorite with existed item!"
    },
    REMOVE_ITEM_NOT_EXISTED : {
        code: 1905,
        message: "Can not remove favorite with item which is not existed!"
    }
}

var PRODUCT_COMMENT = {
    PRODUCT_COMMENT_INVALID : {
        code: 2001,
        message: "Comment is invalid"
    },
    PRODUCT_COMMENT_PARENT_INVALID : {
        code: 2002,
        message: "Comment parent is invalid"
    },
    EDIT_COMMENT_PERMISSION_DENIED : {
        code: 2003,
        message: "You can't EDIT this comment because permission denied!"
    },
    DELETE_COMMENT_PERMISSION_DENIED : {
        code: 2004,
        message: "You can't DELETE this comment because permission denied!"
    },
    EDIT_COMMENT_TYPE_NOT_TEXT : {
        code : 2005,
        message : "You can not edit comment is not TEXT type!"
    }
}

module.exports = {
    SUCCESS : SUCCESS,
    FAIL : FAIL,
    DB_EXECUTE_ERROR : DB_EXECUTE_ERROR,
    ACCESS_TOKEN_INVALID : ACCESS_TOKEN_INVALID,
    USER_REGISTER : USER_REGISTER,
    USER_LOGIN : USER_LOGIN,
    USER_CHANGE_PASSWORD : USER_CHANGE_PASSWORD,
    UPLOAD_FILE : UPLOAD_FILE,
    USER_CONTACT : USER_CONTACT,
    SHOP : SHOP,
    CATEGORY : CATEGORY,
    PRODUCT : PRODUCT,
    ADDRESS : ADDRESS,
    USER_FAVORITE : USER_FAVORITE,
    PRODUCT_COMMENT : PRODUCT_COMMENT
}