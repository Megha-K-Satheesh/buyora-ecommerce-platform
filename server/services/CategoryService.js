const mongoose  = require("mongoose");
const { ErrorFactory } = require("../utils/errors");
const Category = require('../models/admin/Category');

class CategoryService{
    static async addCategory(data){
       
    const {name,parentId,status,isVisible,allowedAttributes} = data;
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

    let validatedAttributes = [];
    if(level ===2){
       if(!allowedAttributes || allowedAttributes.length === 0){
         throw ErrorFactory.validation("Level 2 categories must have Attributes")
       }

       allowedAttributes.forEach(attr=>{
         if(!attr.name || !attr.values || attr.values.length === 0){
             throw ErrorFactory.validation("Each attribute must have a name and at least one value")
         }
       });

       validatedAttributes = allowedAttributes;
    }

    const category = await Category.create({
      name,
      parentId:parentId || null,
      level,
      isLeaf,
       status: status || "active",
      isVisible: isVisible !== undefined ? isVisible : true,
      allowedAttributes : validatedAttributes
    })

   return category
    }
       
     static makeTree(list, parentId = null) {
    return list
      .filter(item => String(item.parentId) === String(parentId) || (parentId === null && !item.parentId))
      .map(item => ({
        ...item,
        children: this.makeTree(list, item._id)
      }));
  }
     

    static async getCategories() {
    const categories = await Category.find().lean();
    return this.makeTree(categories);
  }

  static async categories(page=1,limit=10,level,status,search){
     page = parseInt(page)
     limit = parseInt(limit)
     const skip = (page-1)*limit
    
     const filter ={}

     if(level){
      filter.level = parseInt(level)
     }
     if(status){
      filter.status = status;
     }
     if(search){
      filter.name = {$regex:search,$options:"i"}
     }



     const totalCategories = await Category.countDocuments(filter)

     const categories = await Category.find(filter)
     .populate('parentId','name')
     .skip(skip)
     .limit(limit)
     .lean();
     return {
      data:categories,
      totalPages:Math.ceil(totalCategories/limit),
      currentPage:page,
      totalCategories
     }
  }
  static async updateCategory (categoryId,data){
     const {name,parentId,status,isVisible, allowedAttributes } = data;
     const category = await Category.findById(categoryId)
     if(!category){
      throw ErrorFactory.notFound("Category Not Found")
     }
     let level = 1;
     let isLeaf = false;

     if(parentId){
          if (!mongoose.Types.ObjectId.isValid(parentId)) {
        throw ErrorFactory.validation("Invalid parent category ID");
      }

      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) throw ErrorFactory.notFound("Parent category not found");

      level = parentCategory.level + 1;
      if (level > 3) throw ErrorFactory.validation("Category level cannot exceed 3");

        parentCategory.isLeaf = false;
      await parentCategory.save();

      if (level === 3) isLeaf = true;

     }

    category.name = name !== undefined ? name : category.name;
    category.parentId = parentId !== undefined ? parentId : category.parentId;
    category.level = level;
    category.isLeaf = isLeaf;
    category.status = status !== undefined ? status : category.status;
    category.isVisible = isVisible !== undefined ? isVisible : category.isVisible;
      if (level === 2 && Array.isArray(allowedAttributes)) {
    category.allowedAttributes = allowedAttributes.map(attr => ({
      name: attr.name,
      values: attr.values
    }));
  }
    await category.save();
    return category;

  }
   
  static deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
   console.log(category)
  if (!category) throw ErrorFactory.notFound("Category not found");

  const children = await Category.find({ parentId: new mongoose.Types.ObjectId(categoryId)});

  for (const child of children) {
    await this.deleteCategory(child._id);
  }

  await Category.findByIdAndDelete(categoryId);
  return true;
};

  static getCategoryById = async(categoryId)=>{
    const category = await Category.findById(categoryId);
    if(!category) throw ErrorFactory.notFound("Category not found")
      return category
  }

  static async getCategoryAttributes(categoryId){
     const category = await Category.findById(categoryId)
     if(!category) throw ErrorFactory.notFound("Category not Found")

        if (category.level === 1) {
      return [];
    }
      if (category.level === 2) {
      return category.allowedAttributes || [];
    }

    if (category.level === 3) {
      if (!category.parentId) {
        return [];
      }
      const parentCategory = await Category.findById(category.parentId);

      if (!parentCategory) {
        throw ErrorFactory.notFound("Parent category not found");
      }
         return parentCategory.allowedAttributes || [];
    }
    return [];
  }
   
}
module.exports = CategoryService
