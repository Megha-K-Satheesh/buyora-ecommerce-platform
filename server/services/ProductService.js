



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

   if (category) {
  const allCategories = await Category.find().lean();
  const getChildrenIds = (id) => {
    const children = allCategories.filter(c => String(c.parentId) === String(id));
    return children.reduce((acc, child) => [...acc, child._id, ...getChildrenIds(child._id)], []);
  };
  const ids = [category, ...getChildrenIds(category)];
  filter.category = { $in: ids };
}
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


  static async updateProduct({ id, body, files }) {

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  const {
    name,
    description,
    brand,
    category,
    mrp,
    sellingPrice,
    stock,
    attributes,
    status,
    isVisible,
    existingImages
  } = body;

  const parsedExistingImages = existingImages
    ? JSON.parse(existingImages)
    : [];

  const imagesToDelete = product.images.filter(
    (img) => !parsedExistingImages.includes(img)
  );

  for (const imageUrl of imagesToDelete) {
    const publicId = imageUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);
  }

  const newImages = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      newImages.push(result.secure_url);
    }
  }

  const finalImages = [...parsedExistingImages, ...newImages];

  const updatedMrp = mrp ?? product.mrp;
  const updatedSellingPrice = sellingPrice ?? product.sellingPrice;

  const discountPercentage =
    updatedMrp && updatedSellingPrice
      ? Math.round(((updatedMrp - updatedSellingPrice) / updatedMrp) * 100)
      : 0;

  const parsedVariations = attributes
    ? typeof attributes === "string"
      ? JSON.parse(attributes)
      : attributes
    : product.variations;

  const totalStock = parsedVariations.reduce(
    (sum, v) => sum + Number(v.stock || 0),
    0
  );

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.brand = brand ?? product.brand;
  product.category = category ?? product.category;
  product.mrp = updatedMrp;
  product.sellingPrice = updatedSellingPrice;
  product.discountPercentage = discountPercentage;
  product.status = status ?? product.status;
  product.isVisible = isVisible === "true" || isVisible === true;
  product.stock = Number(stock) || product.stock;
  product.totalStock = totalStock;
  product.variations = parsedVariations;
  product.images = finalImages;

  await product.save();

  return product;
}


static async deleteProduct(id) {

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  for (const imageUrl of product.images) {
    const publicId = imageUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);
  }

  await Product.findByIdAndDelete(id);

  return { message: "Product deleted successfully" };
}



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
