/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var commentProductNorificationService = require("../services/CommentProductNorificationService");
var accessTokenService = require("../services/AccessTokenService");

/* POST count notifi of user */
router.post('/count-notification', [accessTokenService.checkAccessToken, function(req, res, next) {
    commentProductNorificationService.countNotification(req, res);
}]);

/* POST get notifi of user */
router.post('/get-notification-user', [accessTokenService.checkAccessToken, function(req, res, next) {
    commentProductNorificationService.getNotificatiOfUser(req, res);
}]);

/* POST get notifi of shop */
router.post('/get-notification-shop', [accessTokenService.checkAccessToken, function(req, res, next) {
    commentProductNorificationService.getNotificatiOfShop(req, res);
}]);

/* POST make read notifi */
router.post('/make-read', [accessTokenService.checkAccessToken, function(req, res, next) {
    commentProductNorificationService.setNotificationIsRead(req, res);
}]);

module.exports = router;
