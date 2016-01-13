/**
 * Created by LocNT on 7/29/15.
 */

var GENERIC_SQL = {
    SLQ_FINDALL : "SELECT * FROM ??",
    SLQ_FINDALL_ACTIVE : "SELECT * FROM ?? WHERE ?? = 1",
    SLQ_FINDONE_BY_ID : "SELECT * FROM ?? WHERE ?? = ?",
    SLQ_FINDALL_BY_FIELD : "SELECT * FROM ?? WHERE ?? = ?",
    SLQ_FINDALL_BY_FIELD_ACTIVE : "SELECT * FROM ?? WHERE ?? = ? AND isActive = 1",
    SLQ_ADD_NEW : "INSERT INTO ?? SET ?",
    SLQ_UPDATE : "UPDATE ?? SET ? WHERE ?? = ?",
    SLQ_DO_INACTIVE : "UPDATE ?? SET active = 0 WHERE ?? = ?",
    SLQ_REMOVE : "DELETE FROM ?? WHERE ?? = ?"
}

var ACCESS_TOKEN_MODULE = {
    SQL_CHECK_ACCESS : "SELECT * FROM person_access WHERE access_token = ? AND active = 1",
}

var USER_SQL_SCRIPT = {
    CHECK_EMAIL_EXIST : "SELECT u.*,ust.statusValue FROM User u INNER JOIN User_Status ust WHERE email = ?",
    CHECK_LOGIN : "SELECT u.*,ust.statusValue FROM User u INNER JOIN User_Status ust WHERE email = ? AND passWord = ? AND isActive = 1",
    USER_STATUS_SCRIPT : {
        GET_USER_STATUS_ID_BY_VALUE : "SELECT userStatusID FROM User_Status WHERE statusValue = ?"
    },
    FIND_DEVICE_TOKEN_BY_VALUE : "SELECT * FROM User_Device_Token WHERE deviceTokenValue = ?",

    SLQ_CHANGE_PASSWORD : "UPDATE User SET passWord = ? WHERE userID = ?",
    SLQ_REMOVE_ALL_OTHER_BY_USER : "DELETE FROM User_Access_Token WHERE accessTokenValue != ? AND userID = ?",
    SQL_CHECK_ACCESS_TOKEN : "SELECT udt.id, udt.accessTokenValue, u.* FROM User u INNER JOIN User_Access_Token udt ON u.userID = udt.userID WHERE udt.accessTokenValue = ?",

    SQL_GET_USER_PROFILE : "SELECT u.*,ust.statusValue FROM User u INNER JOIN User_Status ust ON u.userStatusID = ust.userStatusID WHERE u.userID = ?",
    
    SQL_SEARCH_USER : "SELECT us.userID, us.email, us.iShowEmail, us.fullName, us.dateOfBirth, us.gender, us.phoneNumber, us.isShowPhoneNumber, us.avatarImageURL, us.coverImageURL, us.isFacebookAccount, IFNULL(ucf.friendStatusID, 0) as friendStatusID, IFNULL(ucf.friendStatusValue, '') as friendStatusValue FROM User us LEFT JOIN (SELECT uc.friendID, ucs.statusID friendStatusID, ucs.statusValue as friendStatusValue FROM User_Contacts uc INNER JOIN User_Contact_Status ucs ON uc.statusID = ucs.statusID INNER JOIN User u ON u.userID = uc.friendID WHERE uc.userID = ?) ucf ON us.userID = ucf.friendID WHERE isActive=1 AND us.userID != ? AND ( fullName LIKE ? OR email LIKE ? ) LIMIT ?, ?",
    SQL_COUNT_NUMBER_SEARCH_USER : "SELECT COUNT(userID) as totalItems FROM User WHERE userID != ? AND (fullName LIKE ? OR email LIKE ?)"
}

var USER_CONTACT_SQL_SCRIPT = {
    SLQ_ADD_NEW_MULTI : "INSERT INTO User_Contacts (id, userID, friendID, statusID, createdDate, modifiedDate) VALUES ?",
    USER_CONTACT_STATUS_SCRIPT : {
        GET_USER_STATUS_ID_BY_VALUE : "SELECT statusID FROM User_Contact_Status WHERE statusValue = ?"
    },
    SLQ_FIND_BY_USER_AND_FRIEND : "SELECT uc.*, ucs.statusValue FROM User_Contacts uc INNER JOIN User_Contact_Status ucs ON uc.statusID = ucs.statusID WHERE uc.userID = ? AND uc.friendID = ?",
    SLQ_UPDATE_STATUS_TO_FRIEND : "UPDATE User_Contacts SET statusID = ? WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)",
    SLQ_DELETE_CONTACT : "DELETE FROM User_Contacts WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)",
    SLQ_UPDATE_STATUS : "UPDATE User_Contacts SET statusID = ? WHERE userID = ? AND friendID = ?",
    SLQ_USER_CONTACT_BY_USER_EXT : "AND ucs.statusValue = ",
    SLQ_COUNT_USER_CONTACT_BY_USER : "SELECT COUNT(id) as totalItems FROM User_Contacts uc INNER JOIN User_Contact_Status ucs ON uc.statusID = ucs.statusID WHERE uc.userID = ? #ext",
    SLQ_FIND_USER_CONTACT_BY_USER_PAGING : "SELECT u.*, ucs.statusValue as friendStatusValue FROM User_Contacts uc INNER JOIN User_Contact_Status ucs ON uc.statusID = ucs.statusID INNER JOIN User u ON u.userID = uc.friendID WHERE uc.userID = ? #ext LIMIT ?, ?"
}

var SHOP_SQL_SCRIPT = {
    CHECK_SHOP_NAME_OF_USER_EXIST : "SELECT * FROM Shop WHERE userID = ? AND shopName = ?",
    SHOP_STATUS_SCRIPT : {
        GET_SHOP_STATUS_ID_BY_VALUE : "SELECT * FROM Shop_Status WHERE shopStatusValue = ?"
    },
    SLQ_ADD_NEW_MULTI_SHOP_TYPE : "INSERT INTO Shop_Type (id, shopID, shopTypeChildID, createdDate) VALUES ?",
    SLQ_ADD_NEW_MULTI_DISTRICT : "INSERT INTO Shop_District (id, shopID, districtID, createdDate) VALUES ?",
    SLQ_REMOVE_MULTI_SHOP_TYPE : "DELETE FROM Shop_Type WHERE shopID = ? AND shopTypeChildID IN ",
    SLQ_REMOVE_ALL_SHOP_TYPE_OF_SHOP : "DELETE FROM Shop_Type WHERE shopID = ?",
    SLQ_REMOVE_MULTI_SHOP_DISTRICT : "DELETE FROM Shop_District WHERE shopID = ? AND districtID IN ",
    SLQ_REMOVE_ALL_SHOP_DISTRICT_OF_SHOP : "DELETE FROM Shop_District WHERE shopID = ?",
    GET_SHOP_BY_USER : "SELECT * FROM Shop WHERE userID = ? AND isActive = 1",
    GET_SHOP_TYPE_BY_SHOP : "SELECT * FROM Shop_Type WHERE shopID = ?",
    GET_SHOP_DISTRICT_BY_SHOP : "SELECT * FROM Shop_District WHERE shopID = ?"
}

var CATEGORY_SQL_SCRIPT = {
    CHECK_CATEGORY_NAME_OF_SHOP_EXIST : "SELECT * FROM Shop_Categories WHERE shopID = ? AND categoryName = ?",
    GET_CATEGORY_BY_SHOP : "SELECT sc.*,(SELECT COUNT(sp.productID) FROM Shop_Product sp WHERE sp.categoryID = sc.categoryID AND sp.isActive= 1) productCount FROM Shop_Categories sc WHERE shopID = ? AND  isActive= 1 ORDER BY sc.categoryID DESC",
    CHECK_PERMISSION_USER_AND_CATEGORY : "SELECT * FROM Shop_Categories sc INNER JOIN Shop sh ON sc.shopID = sh.shopID WHERE sh.userID = ? and sc.categoryID = ?"
}

var SHOP_ADDRESS_SQL_SCRIPT = {
    GET_ADDRESS_BY_SHOP : "SELECT * FROM Shop_Address WHERE shopID = ? AND  isActive= 1 ORDER BY id DESC",
}

var PRODUCT_SQL_SCRIPT = {
    CHECK_PRODUCT_NAME_OF_CATEGORY_EXIST : "SELECT * FROM Shop_Product WHERE categoryID = ? AND productName = ?",
    GET_PRODUCT_BY_CATEGORY : "SELECT *, (SELECT shopID FROM Shop_Categories WHERE categoryID = ?) as shopID FROM Shop_Product WHERE categoryID = ? AND isActive= 1 ORDER BY productID DESC LIMIT ?, ?",
    COUNT_PRODUCT_BY_CATEGORY : "SELECT COUNT(productID) as totalItems FROM Shop_Product WHERE categoryID = ? AND isActive= 1",
    GET_IMAGE_BY_PRODUCT : "SELECT * FROM Shop_Product_Images WHERE productID = ? AND isActive= 1 LIMIT ?, ?",
    COUNT_GET_IMAGE_BY_PRODUCT : "SELECT COUNT(id) as totalItems FROM Shop_Product_Images WHERE productID = ? AND isActive= 1",
    GET_ALL_IMAGE_BY_PRODUCT : "SELECT * FROM Shop_Product_Images WHERE productID = ? AND isActive= 1",
    INCREASE_READ_COUNT : "UPDATE Shop_Product SET readCount = readCount + 1 WHERE productID = ?",
    CHECK_PERMISSION_USER_AND_PRODUCT : "SELECT * FROM Shop_Categories sc INNER JOIN Shop sh ON sc.shopID = sh.shopID INNER JOIN Shop_Product sp ON sp.categoryID = sc.categoryID WHERE sh.userID = ? and sp.productID = ?"
}

var USER_FAVORITE_SQL_SCRIPT = {
    CHECK_FAVORITE_USER_AND_ITEM : "SELECT * FROM User_Favorite_Items WHERE userID = ? AND favoriteItemID = ? AND favoriteType = ?",
    GET_LIST_FAVORITE_COUNT : "SELECT COUNT(id) as totalItems FROM User_Favorite_Items WHERE userID = ?",
    GET_LIST_FAVORITE : "SELECT * FROM User_Favorite_Items WHERE userID = ? #ext LIMIT ?, ?"
}

var COMMENT_SQL_SCRIPT = {
    COUNT_GET_COMMENT_BY_PRODUCT : "SELECT COUNT(commentID) AS totalItems FROM Shop_Product_Comments WHERE productID = ? AND isActive = 1",
    GET_COMMENT_BY_PRODUCT : "SELECT spc.*, u.fullName, u.avatarImageURL FROM Shop_Product_Comments spc INNER JOIN User u ON spc.userID = u.userID WHERE spc.productID = ? AND spc.isActive = 1 ORDER BY spc.commentID DESC LIMIT ?, ?",

    COUNT_GET_COMMENT_BY_PARENT : "SELECT COUNT(commentID) AS totalItems FROM Shop_Product_Comments WHERE parent_CommentID = ? AND isActive = 1",
    GET_COMMENT_BY_PARENT : "SELECT spc.*, u.fullName, u.avatarImageURL FROM Shop_Product_Comments spc INNER JOIN User u ON spc.userID = u.userID WHERE spc.parent_CommentID = ? AND spc.isActive = 1 ORDER BY spc.commentID DESC LIMIT ?, ?"
}

/*Exports*/

module.exports = {
    GENERIC_SQL : GENERIC_SQL,
    ACCESS_TOKEN_MODULE : ACCESS_TOKEN_MODULE,
    USER_SQL_SCRIPT : USER_SQL_SCRIPT,
    USER_CONTACT_SQL_SCRIPT : USER_CONTACT_SQL_SCRIPT,
    SHOP_SQL_SCRIPT : SHOP_SQL_SCRIPT,
    CATEGORY_SQL_SCRIPT : CATEGORY_SQL_SCRIPT,
    PRODUCT_SQL_SCRIPT : PRODUCT_SQL_SCRIPT,
    SHOP_ADDRESS_SQL_SCRIPT : SHOP_ADDRESS_SQL_SCRIPT,
    USER_FAVORITE_SQL_SCRIPT : USER_FAVORITE_SQL_SCRIPT,
    COMMENT_SQL_SCRIPT : COMMENT_SQL_SCRIPT
}