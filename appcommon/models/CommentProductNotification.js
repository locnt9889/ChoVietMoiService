/**
 * Created by LocNT on 8/15/15.
 */

var Constant = require("../helpers/Constant");

function CommentProductNotification(){
    this.id = 0;
    this.shopID = 0;
    this.productID = 0;
    this.fromUserID = 0;
    this.toUserID = 0;
    this.commentID = 0;
    this.isShopComment = false;
    this.isRead = false;
    this.createdDate =  new Date();
};

module.exports = CommentProductNotification;
