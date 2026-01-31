const mongoose  = require("mongoose");
const { ErrorFactory } = require("../utils/errors");
const Category = require('../models/Category');

class CategoryService{
    static async addCategory(data){
       
    const {name,parentId} = data;
    let level = 1;
    let isLeaf = false;

    if(parentId){
       if(!mongoose.Types.ObjectId.isValid(parentId)){
        throw ErrorFactory.validation("Invalid parent category ID");
       }

       const parentCategory = await Category.findById(parentId);
       if(!parentCategory){
        throw ErrorFactory.notFound("Parent category not found")
       }

       level = parentCategory.level + 1;
       if(level > 3){
          throw ErrorFactory.validation("Category level canot exceed 3")
       }

       parentCategory.isLeaf = false;
       await parentCategory.save();

       if(level === 3){
        isLeaf = true;
       }
    }

    const category = await Category.create({
      name,
      parentId:parentId || null,
      level,
      isLeaf
    })

   return category
    }
}
module.exports = CategoryService
