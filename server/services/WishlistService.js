const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/admin/Product");
const { ErrorFactory } = require("../utils/errors");
const CartService = require("./CartService");

class WishlistService {

  static async addToWishlist(userId, productId) {
    if (!userId) throw ErrorFactory.auth("User must be logged in");
    if (!mongoose.Types.ObjectId.isValid(productId))
      throw ErrorFactory.validation("Invalid product ID");

    const product = await Product.findById(productId);
    if (!product) throw ErrorFactory.notFound("Product not found");

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = await Wishlist.create({ userId, items: [] });

  
    if (!wishlist.items.some((id) => id.equals(productId))) {
      wishlist.items.push(productId);
      await wishlist.save();
    }

    return wishlist;
  }

  static async removeFromWishlist(userId, productId) {
    if (!userId) throw ErrorFactory.auth("User must be logged in");

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) throw ErrorFactory.notFound("Wishlist not found");

    wishlist.items = wishlist.items.filter((id) => !id.equals(productId));
    await wishlist.save();

    return wishlist;
  }

  static async getWishlist(userId, { page = 1, limit = 10 } = {}) {
    if (!userId) throw ErrorFactory.auth("User must be logged in");

    let wishlist = await Wishlist.findOne({ userId }).populate("items");
    if (!wishlist) wishlist = await Wishlist.create({ userId, items: [] });

   
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = wishlist.items.slice(startIndex, endIndex);

    return {
      totalItems: wishlist.items.length,
      page,
      limit,
      totalPages: Math.ceil(wishlist.items.length / limit),
      items: paginatedItems,
    };
  }



static async moveToCart(userId, { productId, variationId, size, color, quantity = 1 }, cartService) {
  if (!userId) throw new Error("User must be logged in");

 
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");


  const variation = product.variations.find(v => v._id.toString() === variationId);
  if (!variation) throw new Error("Product variation not found");

 
  const cartItem = {
    productId: product._id,
    variationId: variation._id,
    name: product.name,
    mrp: product.mrp,
    price: product.sellingPrice,
    color: color || variation.attributes.Color || "Default",
    size: size || variation.attributes.Size || "Default",
    image: product.images?.[0] || "", 
    quantity,
  };

  console.log("Cart Item to Add:", cartItem);

  // Add to cart
  await CartService.addToCart(userId, cartItem);


}
}

module.exports = WishlistService;
