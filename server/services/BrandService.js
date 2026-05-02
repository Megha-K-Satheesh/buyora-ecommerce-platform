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


    const categoryIds = category.map(c => c.value);

  
    for (const catId of categoryIds) {
      const cat = await Category.findById(catId);
      if (!cat) {
        throw ErrorFactory.validation(`Category not found: ${catId}`);
      }
      if (cat.level !== 2) {
        throw ErrorFactory.validation(`Only level 2 categories are allowed. Invalid: ${cat.name}`);
      }
    }

    
    const brand = new Brand({
      name,
      categories: categoryIds,
      isVisible: isVisible ?? true
    });

    await brand.save();

    return brand;
  }


  static async getAllBrands({ page = 1, limit = 10, search = "" }) {
  const skip = (page - 1) * limit;

  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const [brands, total] = await Promise.all([
    Brand.find(query)
      .populate("categories", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),

    Brand.countDocuments(query),
  ]);

  return {
    brands,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
}



static async updateBrand(brandId, data) {
  if (!brandId) {
    throw ErrorFactory.validation("Brand ID is required");
  }

  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw ErrorFactory.notFound("Brand not found");
  }

  const { name, category, isVisible } = data;

  if (name !== undefined) brand.name = name;
  if (isVisible !== undefined) brand.isVisible = isVisible;

  if (category !== undefined) {
    const categoryIds = Array.isArray(category)
      ? category
      : [category];

    if (categoryIds.length === 0) {
      throw ErrorFactory.validation("At least one category required");
    }

    for (const catId of categoryIds) {
      const cat = await Category.findById(catId);

      if (!cat) {
        throw ErrorFactory.validation(`Category not found: ${catId}`);
      }

      if (cat.level !== 2) {
        throw ErrorFactory.validation(`Only level 2 categories allowed`);
      }
    }

    brand.categories = categoryIds;
  }

  await brand.save();

  return brand;
}

static async deleteBrand(brandId) {
  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw ErrorFactory.notFound("Brand not found");
  }

  await Brand.findByIdAndDelete(brandId);

  return { message: "Brand deleted successfully" };
}
static async getBrandById(brandId) {
  const brand = await Brand.findById(brandId).populate("categories", "name");

  if (!brand) {
    throw ErrorFactory.notFound("Brand not found");
  }

  return brand;
}
 static async getBrandsByCategoryId(categoryId) {
  if(!categoryId) throw ErrorFactory.validation("not found")
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
