const mongoose = require("mongoose");
const Product = require("../../models/admin/Product");
const Category = require("../../models/admin/Category");
const Brand = require("../../models/admin/Brand");
const { ErrorFactory } = require("../../utils/errors");

class UserProductService {

  static async getProducts({
    level1,
    level2,
    level3,
    brand,
    minPrice,
    maxPrice,
    size,
    color,
    discount,
    search,
    page = 1,
    limit = 10,
    sort,
  }) {

    console.log(level1,level2,level3)
  const filters = {};

  let level1Doc = null;
  if (level1) {
    level1Doc = await Category.findOne({ slug: level1, level: 1 });
    if (!level1Doc) throw ErrorFactory.notFound("Level1 category not found");
  }

  let categoryIds = [];

  if (level3) {
    if (!level2) throw ErrorFactory.validation("Level2 is required when Level3 is provided");
    const level2Doc = await Category.findOne({ slug: level2, parentId: level1Doc?._id });
    if (!level2Doc) throw ErrorFactory.notFound("Level2 category not found");
    const level3Doc = await Category.findOne({ slug: level3, parentId: level2Doc._id });
    if (!level3Doc) throw ErrorFactory.notFound("Level3 category not found");
    categoryIds = [level3Doc._id];
  } else if (level2) {
    const level2Doc = await Category.findOne({ slug: level2, parentId: level1Doc?._id });
    if (!level2Doc) throw ErrorFactory.notFound("Level2 category not found");
    const level3Docs = await Category.find({ parentId: level2Doc._id, level: 3 }).select("_id");
    categoryIds = level3Docs.map(c => c._id);
  } else if (level1) {
    const level2Docs = await Category.find({ parentId: level1Doc._id, level: 2 }).select("_id");
    const level3Docs = await Category.find({ parentId: { $in: level2Docs.map(d => d._id) }, level: 3 }).select("_id");
    categoryIds = level3Docs.map(c => c._id);
  }

  if (categoryIds.length) filters.category = { $in: categoryIds };

  if (brand) {
    const brandArr = Array.isArray(brand) ? brand : brand.split(",");
    if (brandArr.length) filters.brand = { $in: brandArr };
  }

  let colorArr = [];
  let sizeArr = [];
  if (color) colorArr = Array.isArray(color) ? color : color.split(",");
  if (size) sizeArr = Array.isArray(size) ? size : size.split(",");
  if (colorArr.length || sizeArr.length) {
    const elemMatch = { isActive: true };
    if (colorArr.length) elemMatch["attributes.Color"] = { $in: colorArr };
    if (sizeArr.length) elemMatch["attributes.Size"] = { $in: sizeArr };
    filters.variations = { $elemMatch: elemMatch };
  }

  if (minPrice || maxPrice) {
    filters.sellingPrice = {};
    if (minPrice) filters.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) filters.sellingPrice.$lte = Number(maxPrice);
  }

  if (discount) {
    const discountArr = Array.isArray(discount) ? discount : discount.split(",");
    const discountFilter = discountArr.map(range => {
      const [minD, maxD] = range.split("-");
      if (maxD === "above") return { discountPercentage: { $gte: Number(minD) } };
      return { discountPercentage: { $gte: Number(minD), $lte: Number(maxD) } };
    });
    if (discountFilter.length) filters.$or = discountFilter;
  }

  if (search) filters.name = { $regex: search, $options: "i" };

  const sortOption = {};
  if (sort === "priceAsc") sortOption.sellingPrice = 1;
  else if (sort === "priceDesc") sortOption.sellingPrice = -1;
  else sortOption.createdAt = -1;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filters)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .populate("brand", "_id name");

  const total = await Product.countDocuments(filters);

  return { products, pages: Math.ceil(total / limitNum), total };
}

  static async getSidebarFilters(level1Slug,level2Slug) {
    console.log("dddddddddddddddddddd",level2Slug)


  if (!level1Slug) throw ErrorFactory.validation("Level1 slug is required");
  if (!level2Slug) throw ErrorFactory.validation("Level2 slug is required");

  const level1Category = await Category.findOne({ slug: level1Slug, level: 1 });
  if (!level1Category) throw ErrorFactory.notFound("Level1 category not found");

  const level2Category = await Category.findOne({ slug: level2Slug, parentId: level1Category._id, level: 2 });
  if (!level2Category) throw ErrorFactory.notFound("Level2 category not found");

  const level3Categories = await Category.find({ parentId: level2Category._id, level: 3 }).select("_id name slug");
  const level3Ids = level3Categories.map(c => c._id);

  const brands = await Brand.find({
    categories: { $in: [level2Category._id] },
    isActive: true
  }).select("_id name");

  const priceAgg = await Product.aggregate([
    { $match: { category: { $in: level3Ids }, status: "active" } },
    { $group: { _id: null, min: { $min: "$sellingPrice" }, max: { $max: "$sellingPrice" } } },
  ]);
  const priceRange = priceAgg[0] || { min: 0, max: 0 };

  const sizes = [];
  const colors = [];
  level2Category.allowedAttributes.forEach(attr => {
    if (attr.name.toLowerCase() === "size") sizes.push(...attr.values);
    if (attr.name.toLowerCase() === "color") colors.push(...attr.values);
  });

  const discountRanges = [
    { label: "10% - 20%", value: "10-20" },
    { label: "20% - 30%", value: "20-30" },
    { label: "30% - 40%", value: "30-40" },
    { label: "40% & above", value: "40-above" },
  ];

  return {
    heading: level2Category.name,
    categories: level3Categories,
    brands,
    priceRange,
    sizes,
    colors,
    discountRanges
  };
   

  

}

static async getProductById(productId) {
  const product = await Product.findById(productId)
    .populate("brand", "_id name") // brand info
    .populate("category", "_id name level slug") 
    .select("name description brand category sellingPrice originalPrice discountPercentage attributes variations images ratings");

  if (!product) throw ErrorFactory.notFound("Product not found");

  return product;
}

}

module.exports = UserProductService;

