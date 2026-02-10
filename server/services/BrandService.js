const Brand = require("../models/admin/Brand");
const Category = require("../models/admin/Category");
const { ErrorFactory } = require("../utils/errors");
const mongoose = require("mongoose");


class BrandService {
      static async addBrand(data){
         const { name, category, isVisible } = data;

    if (!name) {
      throw ErrorFactory.validation("Brand name is required");
    }

    if (!category || !Array.isArray(category) || category.length === 0) {
      throw ErrorFactory.validation("Please select at least one category");
    }

    // Extract category IDs from frontend array
    const categoryIds = category.map(c => c.value);

    // Validate each category
    for (const catId of categoryIds) {
      const cat = await Category.findById(catId);
      if (!cat) {
        throw ErrorFactory.validation(`Category not found: ${catId}`);
      }
      if (cat.level !== 2) {
        throw ErrorFactory.validation(`Only level 2 categories are allowed. Invalid: ${cat.name}`);
      }
    }

    // Create new brand
    const brand = new Brand({
      name,
      categories: categoryIds,
      isVisible: isVisible ?? true
    });

    await brand.save();

    return brand;
  }
 static async getBrandsByCategoryId(categoryId) {
    if (!categoryId) return [];
    const category = await Category.findById(categoryId);
    if (!category) return [];
    const parentL2Id = category.parentId;
    if (!parentL2Id) return [];
    const brands = await Brand.find({
      categories: { $in: [new mongoose.Types.ObjectId(parentL2Id)] },
  
       isActive: true,
    });
    return brands;
  }
}
module.exports = BrandService
