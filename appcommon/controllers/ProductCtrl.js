/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var productService = require("../services/ProductService");
var accessTokenService = require("../services/AccessTokenService");

/* POST create product */
router.post('/create', [accessTokenService.checkAccessToken, function(req, res, next) {
    productService.createProduct(req, res);
}]);

/* POST get product by category*/
router.post('/getProductByCategory', [accessTokenService.checkAccessToken, function(req, res, next) {
    productService.getProductByCategory(req, res);
}]);

/* POST get detail product */
router.post('/getProductDetail', [accessTokenService.checkAccessToken, function(req, res, next) {
    productService.getProductDetail(req, res);
}]);

/* POST delete product */
router.post('/deleteProduct', [accessTokenService.checkAccessToken,productService.checkPermissionUserAndCategory, function(req, res, next) {
    productService.deleteProduct(req, res);
}]);

/* POST update product */
router.post('/updateProduct', [accessTokenService.checkAccessToken,productService.checkPermissionUserAndCategory, function(req, res, next) {
    productService.updateProduct(req, res);
}]);

/* POST create product image */
router.post('/createProductImage', [accessTokenService.checkAccessToken,productService.checkPermissionUserAndCategory, function(req, res, next) {
    productService.createProductImage(req, res);
}]);

/* POST get Image By Product */
router.post('/getImageByProduct', [accessTokenService.checkAccessToken, function(req, res, next) {
    productService.getImageByProduct(req, res);
}]);

/* POST get delete Product */
router.post('/deleteProductImage', [accessTokenService.checkAccessToken, function(req, res, next) {
    productService.deleteProductImage(req, res);
}]);

/* POST search */
router.post('/search', [accessTokenService.checkAccessToken, function(req, res, next) {
    productService.search(req, res);
}]);

module.exports = router;
