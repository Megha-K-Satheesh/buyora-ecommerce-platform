



const { S3, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const { uploadToS3, s3 } = require('../config/s3Service');
const Category = require('../models/admin/Category');
const Product = require('../models/admin/Product');
const { ErrorFactory } = require('../utils/errors');



class ProductService {

static async addProduct({ body, files }) {
  const {
    name,
    description,
    brand,
    category,
    mrp,
    sellingPrice,
    attributes,
    status,
    isVisible,
    variations
  } = body;

  const images = await Promise.all(
    files.map(file => uploadToS3(file))
  );

  const discountPercentage =
    mrp && sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const parsedAttributes =
    typeof attributes === "string"
      ? JSON.parse(attributes)
      : attributes || {};

  if (!variations || variations.length === 0) {
    throw ErrorFactory.validation("Variations are required");
  }

  const formattedVariants = variations.map((v) => ({
    attributes: new Map(Object.entries(v.attributes)),
    stock: Number(v.stock) || 0,
  }));

  const totalStock = formattedVariants.reduce(
    (sum, v) => sum + v.stock,
    0
  );

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
    attributes: parsedAttributes,
    variations: formattedVariants,
    images,
  });

  await product.save();
  return product;
}

   static async getProductsList({ category, status, priceSort, page = 1, limit = 10 ,search}) {

       page = parseInt(page)
     limit = parseInt(limit)
    const filter = {};




  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }
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


  if (!product) throw ErrorFactory.notFound("Product not found");

  const {
    name,
    description,
    brand,
    category,
    mrp,
    sellingPrice,
    stock,
    variations,
    status,
    isVisible,
    existingImages
  } = body;

 

  const parsedExistingImages = Array.isArray(existingImages)
    ? existingImages
    : existingImages
      ? JSON.parse(existingImages)
      : [];



  const imagesToDelete = product.images.filter(
    (img) => !parsedExistingImages.includes(img)
  );



  const getKeyFromUrl = (url) => {
    try {
      return decodeURIComponent(new URL(url).pathname.substring(1));
    } catch (err) {
      console.log("DEBUG: Invalid URL:", url);
      return null;
    }
  };

  for (const imageUrl of imagesToDelete) {
    const Key = getKeyFromUrl(imageUrl);

  

    if (!Key) continue;

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key
        })
      );

   
    } catch (err) {
      console.log("DEBUG: S3 delete error:", err.message);
    }
  }

  const newImages = files?.length
    ? await Promise.all(files.map(file => uploadToS3(file)))
    : [];



  const finalImages = [
    ...parsedExistingImages,
    ...newImages
  ];

  console.log("DEBUG: finalImages:", finalImages);

  const updatedMrp = mrp ?? product.mrp;
  const updatedSellingPrice = sellingPrice ?? product.sellingPrice;

  console.log("DEBUG: updatedMrp / updatedSellingPrice:", updatedMrp, updatedSellingPrice);

  const discountPercentage =
    updatedMrp && updatedSellingPrice
      ? Math.round(((updatedMrp - updatedSellingPrice) / updatedMrp) * 100)
      : 0;

  console.log("DEBUG: discountPercentage:", discountPercentage);

  // const parsedVariations = variations || product.variations;

  // console.log("DEBUG: parsedVariations:", parsedVariations);

  // const totalStock = parsedVariations.reduce(
  //   (sum, v) => sum + Number(v.stock || 0),
  //   0
  // );


const parsedVariations = variations || product.variations || [];

// keep existing variation IDs safe
const existingMap = new Map(
  product.variations.map(v => [v._id.toString(), v])
);

const safeVariations = parsedVariations.map(v => {
  const id = v._id?.toString();

  if (id && existingMap.has(id)) {
    return {
      ...existingMap.get(id).toObject(),
      stock: v.stock,
      isActive: v.isActive,
      attributes: v.attributes
    };
  }

  return v;
});

const totalStock = safeVariations.reduce(
  (sum, v) => sum + Number(v.stock || 0),
  0
);




  console.log("DEBUG: totalStock:", totalStock);

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
  product.variations =  safeVariations;
  product.images = finalImages;

  console.log("DEBUG: Final product before save:", {
    name: product.name,
    stock: product.stock,
    totalStock: product.totalStock,
    imagesCount: product.images.length
  });

  await product.save();

  console.log("DEBUG: Product saved successfully");

  return product;
}

static async deleteProduct(id) {

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

 
  for (const imageUrl of product.images) {

    try {
      const key = decodeURIComponent(
        new URL(imageUrl).pathname.substring(1)
      );

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key
        })
      );

      console.log("Deleted from S3:", key);

    } catch (err) {
      console.log("S3 delete error:", err.message);
    }
  }


  await Product.findByIdAndDelete(id);

  return { message: "Product deleted successfully" };
}

  }



    


function generateVariants(attributes) {
  const keys = Object.keys(attributes);
  if (!keys.length) return [];

  let variants = [{}];
  keys.forEach((key) => {
    let values = attributes[key];
    
   
    if (!Array.isArray(values)) {
      values = [values];
    }

    const temp = [];
    variants.forEach((variant) => {
      values.forEach((value) => {
        temp.push({ ...variant, [key]: value });
      });
    });
    variants = temp;
  });

  return variants;
}

  


module.exports = ProductService;
