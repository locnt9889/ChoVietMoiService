/**
 * Created by LocNT on 7/29/15.
 */

var GENERIC_SQL = {
    SLQ_FINDALL : "SELECT * FROM ??",
    SLQ_FINDALL_ACTIVE : "SELECT * FROM ?? WHERE ?? = 1",
    SLQ_FINDONE_BY_ID : "SELECT * FROM ?? WHERE ?? = ?",
    SLQ_ADD_NEW : "INSERT INTO ?? SET ?",
    SLQ_UPDATE : "UPDATE ?? SET ? WHERE ?? = ?",
    SLQ_DO_INACTIVE : "UPDATE ?? SET active = 0 WHERE ?? = ?",
    SLQ_REMOVE : "DELETE FROM ?? WHERE id = ?"
}

var ACCESS_TOKEN_MODULE = {
    SQL_CHECK_ACCESS : "SELECT * FROM person_access WHERE access_token = ? AND active = 1"
}

var USER_SQL_SCRIPT = {
    CHECK_EMAIL_EXIST : "SELECT * FROM User WHERE email = ?",
    CHECK_LOGIN : "SELECT u.*,ust.statusValue FROM User u INNER JOIN User_Status ust WHERE email = ? AND passWord = ? AND isActive = 1",
    USER_STATUS_SCRIPT : {
        GET_USER_STATUS_ID_BY_VALUE : "SELECT userStatusID FROM User_Status WHERE statusValue = ?"
    },
    FIND_DEVICE_TOKEN_BY_VALUE : "SELECT * FROM User_Device_Token WHERE deviceTokenValue = ?"

}

/*Exports*/

module.exports = {
    GENERIC_SQL : GENERIC_SQL,
    ACCESS_TOKEN_MODULE : ACCESS_TOKEN_MODULE,
    USER_SQL_SCRIPT : USER_SQL_SCRIPT
}