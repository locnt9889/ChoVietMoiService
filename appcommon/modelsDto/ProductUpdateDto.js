/**
 * Created by LocNT on 8/15/15.
 */

function ProductUpdateDto(){
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
    this.modifiedDate = new Date();
};

module.exports = ProductUpdateDto;
