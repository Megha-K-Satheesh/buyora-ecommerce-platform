



const cloudinary = require('../config/cloudinaryConfig');
const Product = require('../models/admin/Product');



class ProductService {
  static async addProduct({ body, files }) {
    const { name, description, brand, category, mrp, sellingPrice, stock, attributes,status,isVisible } = body;

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
  console.log("No attributes provided, variants will be empty");
}

   console.log("Parsed attributes:", parsedAttributes);

    const variants = generateVariants(parsedAttributes).map((variant) => ({
      attributes: new Map(Object.entries(variant)),
      stock: Number(stock) || 0,
      
    }));

    const product = new Product({
      name,
      description,
      brand,
      category,
      mrp,
      sellingPrice,
      discountPercentage,
      
     status: status || "active",
     isVisible,
      stock: stock || 0,
      attributes: parsedAttributes,
       variations: variants,
      images,
    });

    await product.save();
    return product;
  }
}

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
console.log("Generated variants:", variants);
  return variants;
}

module.exports = ProductService;
