const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const { ErrorFactory } = require("../utils/errors");
const Product = require("../models/admin/Product");

class CartService {

 
  static async addToCart(userId, cartItem) {
    // console.log(cartItem,userId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw ErrorFactory.validation("Invalid user ID");
    }
    if (!cartItem.productId || !cartItem.variationId) {
      throw ErrorFactory.validation("ProductId and VariationId are required");
    }

    const product = await Product.findById(cartItem.productId);
    if (!product) throw ErrorFactory.notFound("Product not found");

    const variationExists = product.variations.some(v => v._id.equals(cartItem.variationId));
    if (!variationExists) throw ErrorFactory.validation("Invalid variation for this product");

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [cartItem] });
      return cart; 
    }

    // const existingItem = cart.items.find(
    //   x => x.productId.equals(cartItem.productId) && x.variationId === cartItem.variationId
    // );
    const existingItem = cart.items.find(
  x =>
    x.productId.equals(cartItem.productId) &&
    x.variationId.equals(cartItem.variationId)
);


    if (existingItem) {
      existingItem.quantity += cartItem.quantity || 1;
    } else {
      cart.items.push(cartItem);
    }

    await cart.save();
    return cart; 
  
  }

static async mergeCart(userId, guestCart = []) {
  if (!guestCart || guestCart.length === 0) {
    throw ErrorFactory.notFound("guestCart not found");
  }
  console.log("hi")
  
  
  const cart = await Cart.findOne({ userId }) || await Cart.create({ userId, items: [] });
  console.log(cart)
  
  const normalizedGuestCart = guestCart.map(item => ({
    ...item,
    productId: new mongoose.Types.ObjectId(item.productId),
    variationId: new mongoose.Types.ObjectId(item.variationId),
  }));

  for (const item of normalizedGuestCart) {

    // const existingItem = cart.items.find(
    //   x =>
    //     x.productId.equals(item.productId) &&
    //     x.variationId.equals(item.variationId)
    // );
const existingItem = cart.items.find(
  x => x.variationId.equals(item.variationId)
);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      cart.items.push(item);
    }
  }

  await cart.save();
  return cart; 
}



  static async removeFromCart(userId, variationId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;
  
    const varId =new  mongoose.Types.ObjectId(variationId); 
  cart.items = cart.items.filter(x => !x.variationId.equals(varId));
    await cart.save();
    return cart; 
  }


  static async updateCartQuantity(userId, variationId, quantity) {

      console.log("validation",variationId)

    if (quantity < 1) throw ErrorFactory.validation("Quantity must be at least 1");

    const cart = await Cart.findOne({ userId });
    if (!cart) throw ErrorFactory.notFound("Cart not found");
      const varId = new mongoose.Types.ObjectId(variationId); 
    const item = cart.items.find(x => x.variationId.equals(varId)); 

    // const item = cart.items.find(x => x.variationId === variationId);
    if (!item) throw ErrorFactory.notFound("Cart item not found");

    item.quantity = quantity;
    await cart.save();
    return cart; 
  }


  static async getCart(userId) {
    let cart = await Cart.findOne({ userId });
    console.log("get cart",cart)
    if (!cart) {
      

    cart = await Cart.create({ userId, items: [] });
  }
    return cart 
  }

}

module.exports = CartService;
