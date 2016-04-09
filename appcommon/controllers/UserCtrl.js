/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var userService = require("../services/UserService");
var accessTokenService = require("../services/AccessTokenService");

/* POST register. */
router.post('/register-email', function(req, res, next) {
    userService.registerByEmail(req, res);
});

/* POST login. */
router.post('/login-email', function(req, res, next) {
    userService.loginByEmail(req, res);
});

/* POST login. by fb */
router.post('/login-fb', function(req, res, next) {
    userService.loginByFb(req, res);
});

/* POST logout*/
router.post('/logout', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.logout(req, res);
}]);

/* POST change password */
router.post('/changePassword', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.changePassword(req, res);
}]);

/* POST get user profile */
router.post('/getUserProfile', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.getUserProfile(req, res);
}]);

/* POST get other user profile */
router.post('/getOtherProfile', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.getOtherProfile(req, res);
}]);

/* POST update user profile */
router.post('/updateUserProfile', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.updateUserProfile(req, res);
}]);

/* POST update user profile */
router.post('/updateUserAvatar', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.updateAvatar(req, res);
}]);

/* POST update user profile */
router.post('/updateUserCover', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.updateCover(req, res);
}]);

/* POST search user by fullName and email */
router.post('/searchUser', [accessTokenService.checkAccessToken, function(req, res, next) {
    userService.searchUser(req, res);
}]);

module.exports = router;
