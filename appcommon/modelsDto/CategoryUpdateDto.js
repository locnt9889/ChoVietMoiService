/**
 * Created by LocNT on 8/15/15.
 */

function CategoryUpdateDto(){
    this.categoryName = "";
    this.categoryDesc = "";
    this.isShow = 1;
    this.modifiedDate = new Date();
};

module.exports = CategoryUpdateDto;
