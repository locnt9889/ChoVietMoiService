/**
 * Created by LocNT on 8/15/15.
 */

function Product(){
    this.productID = 0;
    this.categoryID = 0;
    this.productName = "";
    this.productCode = "";
    this.isShow = 1;
    this.count = 0;
    this.price = 0.0;
    this.isSale = 0;
    this.salePrice = 0.0;
    this.dateStartSale = new Date();
    this.dateEndSale = new Date();
    this.productProperties = "";
    this.isActive = 1;
    this.readCount = 0;
    this.createdDate = new Date();
    this.modifiedDate = new Date();
};

module.exports = Product;
