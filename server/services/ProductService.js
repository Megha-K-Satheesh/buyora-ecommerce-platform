



const cloudinary = require('../config/cloudinaryConfig');
const Category = require('../models/admin/Category');
const Product = require('../models/admin/Product');



class ProductService {
  static async addProduct({ body, files }) {
    const { name, description, brand, category, mrp, sellingPrice, stock, attributes,status,isVisible } = body;


     console.log(brand)
     
    const images = [];
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      images.push(result.secure_url);
    }

    const discountPercentage = mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    const parsedAttributes = attributes 
  ? (typeof attributes === "string" ? JSON.parse(attributes) : attributes)
  : {};
  if (Object.keys(parsedAttributes).length === 0) {
  // console.log("No attributes provided, variants will be empty");
}

  //  console.log("Parsed attributes:", parsedAttributes);

    const variants = generateVariants(parsedAttributes).map((variant) => ({
      attributes: new Map(Object.entries(variant)),
      stock: Number(stock) || 0,
      
    }));
     const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const product = new Product({
      name,
      description,
      brand,
      category,
      mrp,
      sellingPrice,
      discountPercentage,
      totalStock,
     status: status || "active",
     isVisible,
      stock:Number(stock) || 0,
      attributes: parsedAttributes,
       variations: variants,
      images,
    });

    await product.save();
    return product;
  }


   static async getProductsList({ category, status, priceSort, page = 1, limit = 10 }) {

       page = parseInt(page)
     limit = parseInt(limit)
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments(filter);

    let sort = { createdAt: -1 };
    if (priceSort === "lowToHigh") sort = { sellingPrice: 1 };
    if (priceSort === "highToLow") sort = { sellingPrice: -1 };

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);

   return {
    data: products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
    totalProducts,
  };
  }

// static async getProducts({
//   category,
//   brand,
//   minPrice,
//   maxPrice,
//   size,
//   color,
//   discount,
//   search,
//   page = 1,
//   limit = 10,
//   sort
// }) {

//   let filter = {};

//   //  Category
//   if (category) {
//     filter.category = category;
//   }

//   //  Brand
//   if (brand) {
//     filter.brand = brand;
//   }

//   //  Price
//   if (minPrice || maxPrice) {
//     filter.sellingPrice  = {};
//     if (minPrice) filter.sellingPrice .$gte = Number(minPrice);
//     if (maxPrice) filter.sellingPrice .$lte = Number(maxPrice);
//   }

// if (discount) {
//   if (discount.includes("-")) {

//     const [min, max] = discount.split("-");

//     if (max === "above") {
//       filter.discountPercentage = { $gte: Number(min) };
//     } else {
//       filter.discountPercentage = {
//         $gte: Number(min),
//         $lte: Number(max)
//       };
//     }

//   }
// }


//   //  Search
//   if (search) {
//     filter.name = { $regex: search, $options: "i" };
//   }

//   //  Variant (Size + Color)
//   if (size || color) {
//     const elemMatch = { isActive: true };

//     if (size) {
//       elemMatch["attributes.size"] = {
//         $in: size.split(",")
//       };
//     }

//     if (color) {
//       elemMatch["attributes.color"] = {
//         $in: color.split(",")
//       };
//     }

//     filter.variations = { $elemMatch: elemMatch };
//   }

//   // Sorting
//   let sortOption = {};
//   if (sort === "price_asc") sortOption.sellingPrice = 1;
//   if (sort === "price_desc") sortOption.sellingPrice = -1;
//   if (sort === "newest") sortOption.createdAt = -1;
//    if (sort === "rating_desc") sortOption.rating = -1;
//    if (sort === "rating_asc") sortOption.rating = 1;


//   //  Pagination
//   const skip = (Number(page) - 1) * Number(limit);

//   const products = await Product.find(filter)
//     .sort(sortOption)
//     .skip(skip)
//     .limit(Number(limit));

//   const total = await Product.countDocuments(filter);

//   return {
//     products,
//     total,
//     page: Number(page),
//     pages: Math.ceil(total / limit)
//   };
// }



//      static async getSidebarFilters(categoryId) {

//     if (!categoryId) {
//       throw new Error("Category ID is required");
//     }

//     const currentCategory = await Category.findById(categoryId);

//     if (!currentCategory) {
//       throw new Error("Category not found");
//     }

//     let level2Id;

//     if (currentCategory.level === 3) {
//       level2Id = currentCategory.parentId;
//     } else if (currentCategory.level === 2) {
//       level2Id = currentCategory._id;
//     } else {
//       throw new Error("Invalid category level");
//     }

//     const level2Category = await Category.findById(level2Id);

//     const level3Categories = await Category.find({
//       parent: level2Id,
//       level: 3
//     }).select("_id name slug");

//     const level3Ids = level3Categories.map(cat => cat._id);

//     const priceRangeResult = await Product.aggregate([
//       {
//         $match: {
//           category: { $in: level3Ids },
//           status: "active",
//          isVisible: true
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           min: { $min:"$sellingPrice" },
//           max: { $max:"$sellingPrice" }
//         }
//       }
//     ]);

//     const priceRange = priceRangeResult[0] || { min: 0, max: 0 };

//     const brands = await Product.aggregate([
//       {
//         $match: {
//           category: { $in: level3Ids },
//           status: "active",
//         isVisible: true
//         }
//       },
//       {
//         $group: {
//           _id: "$brand",
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $lookup: {
//           from: "brands",
//           localField: "_id",
//           foreignField: "_id",
//           as: "brandData"
//         }
//       },
//       { $unwind: "$brandData" },
//       {
//         $project: {
//           _id: 0,
//           id: "$brandData._id",
//           name: "$brandData.name",
//           count: 1
//         }
//       }
//     ]);

//     const variationData = await Product.aggregate([
//       {
//         $match: {
//           category: { $in: level3Ids },
//          status: "active",
// isVisible: true
//         }
//       },
//       { $unwind: "$variations" },
//       {
//         $match: {
//           "variations.isActive": true
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           sizes: { $addToSet: "$variations.attributes.size" },
//           colors: { $addToSet: "$variations.attributes.color" }
//         }
//       }
//     ]);

//     const sizes = variationData[0]?.sizes || [];
//     const colors = variationData[0]?.colors || [];

//     const discountRanges = [
//       { label: "10% - 20%", value: "10-20" },
//       { label: "20% - 30%", value: "20-30" },
//       { label: "30% - 40%", value: "30-40" },
//       { label: "40% & above", value: "40-above" }
//     ];

//     return {
//       level2Heading: level2Category.name,
//       level3Categories,
//       priceRange,
//       brands,
//       sizes,
//       colors,
//       discountRanges
//     };
  }



    
//function
function generateVariants(attributes) {
  const keys = Object.keys(attributes);
  if (!keys.length) return [];

  let variants = [{}];
  keys.forEach((key) => {
    const values = attributes[key];
    const temp = [];
    variants.forEach((variant) => {
      values.forEach((value) => {
        temp.push({ ...variant, [key]: value });
      });
    });
    variants = temp;
  });
// console.log("Generated variants:", variants);
  return variants;
 
}

  


module.exports = ProductService;
