



const { S3, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const { uploadToS3, s3 } = require('../config/s3Service');
const Category = require('../models/admin/Category');
const Product = require('../models/admin/Product');



class ProductService {
  static async addProduct({ body, files }) {
    const { name, description, brand, category, mrp, sellingPrice, stock, attributes,status,isVisible } = body;


     
     
    
    



const images = await Promise.all(
  files.map(file => uploadToS3(file))
);
    const discountPercentage = mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    const parsedAttributes = attributes 
  ? (typeof attributes === "string" ? JSON.parse(attributes) : attributes)
  : {};
  if (Object.keys(parsedAttributes).length === 0) {

}



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
      console.log("Invalid URL:", url);
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

      console.log("Deleted from S3:", Key);
    } catch (err) {
      console.log("S3 delete error:", err.message);
    }
  }

 
  const newImages = files?.length
    ? await Promise.all(files.map(file => uploadToS3(file)))
    : [];

 
  
  const finalImages = [
    ...parsedExistingImages,
    ...newImages
  ];




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
