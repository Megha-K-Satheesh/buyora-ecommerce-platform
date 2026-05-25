



const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/admin/Product");
const { ErrorFactory } = require("../utils/errors");

class CartService {

  static async addToCart(userId, cartItem) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw ErrorFactory.validation("Invalid user ID");
    }
    if (!cartItem.productId || !cartItem.variationId) {
      throw ErrorFactory.validation("ProductId and VariationId are required");
    }

    const product = await Product.findById(cartItem.productId);
    if (!product) throw ErrorFactory.notFound("Product not found");

   



    const variation = product.variations.find(v =>
  v._id.equals(cartItem.variationId)
);

if (!variation) {
  throw ErrorFactory.validation("Invalid variation for this product");
}

    const requestedQty = cartItem.quantity || 1;

if (requestedQty > variation.stock) {
  throw ErrorFactory.validation(
    `Only ${variation.stock} items available`
  );
}
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const existingItem = cart.items.find(
      x => x.productId.equals(cartItem.productId) && x.variationId.equals(cartItem.variationId)
    );



   if (existingItem) {

  const newQty =
    existingItem.quantity + requestedQty;

  if (newQty > variation.stock) {
    throw ErrorFactory.validation(
      `Only ${variation.stock} items available`
    );
  }

  existingItem.quantity = newQty;

} else {

  cart.items.push({
    ...cartItem,
    quantity: requestedQty
  });
}
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
  
     cart.finalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
   
    await cart.save();
    return cart;
  }





  static async mergeCart(userId, guestCart = []) {
    if (!guestCart || guestCart.length === 0) {
      return await CartService.getCart(userId); 
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

 
    const normalizedGuestCart = guestCart.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
      variationId: new mongoose.Types.ObjectId(item.variationId),
    }));

   
for (const guestItem of normalizedGuestCart) {

  const product = await Product.findById(
    guestItem.productId
  );

  if (!product) continue;

  const variation = product.variations.find(v =>
    v._id.equals(guestItem.variationId)
  );

  if (!variation) continue;

  const guestQty = guestItem.quantity || 1;

  const existingItem = cart.items.find(
    x => x.variationId.equals(guestItem.variationId)
  );

  if (existingItem) {

    const newQty =
      existingItem.quantity + guestQty;

    existingItem.quantity =
      Math.min(newQty, variation.stock);

  } else {

    cart.items.push({
      ...guestItem,
      quantity: Math.min(
        guestQty,
        variation.stock
      )
    });
  }
}
  
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
  
     cart.finalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();


    return {
      items: cart.items,
      appliedCoupon: cart.appliedCouponCode || null,
      discountAmount: cart.discountAmount || 0,
      finalAmount: cart.finalAmount || 0,
    };
  }

  static async removeFromCart(userId, variationId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw ErrorFactory.notFound("Cart not found");

    const varId = new mongoose.Types.ObjectId(variationId);
    cart.items = cart.items.filter(x => !x.variationId.equals(varId));

    
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
   
     cart.finalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();
    return cart;
  }


static async updateCartQuantity(userId, variationId, quantity) {
  console.log("debug code", userId, variationId, quantity);

  if (quantity < 1) {
    throw ErrorFactory.validation("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw ErrorFactory.notFound("Cart not found");
  }

  const item = cart.items.find(x =>
    x.variationId?.toString() === variationId?.toString()
  );

  if (!item) {
    throw ErrorFactory.notFound("Cart item not found");
  }

  const product = await Product.findById(item.productId);

  if (!product) {
    throw ErrorFactory.notFound("Product not found");
  }

  const variation = product.variations?.find(
    v => v._id?.toString() === item.variationId.toString()
  );

  if (!variation) {
    throw ErrorFactory.notFound(
      "This product variant is no longer available"
    );
  }

  if (quantity > variation.stock) {
    throw ErrorFactory.validation(
      `Only ${variation.stock} items available`
    );
  }

  item.quantity = quantity;

  cart.appliedCouponId = null;
  cart.appliedCouponCode = null;
  cart.discountAmount = 0;

  cart.finalAmount = cart.items.reduce((sum, i) => {
    return sum + (i.price || 0) * (i.quantity || 0);
  }, 0);

  await cart.save();

  return cart;
}
 

static async getCart(userId) {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: []
    });
  }

  const updatedItems = await Promise.all(
    cart.items.map(async (item) => {

      const product = await Product.findById(item.productId);

      if (!product) return null;

      const variation = product.variations.find(v =>
        v._id.toString() === item.variationId.toString()
      );

      if (!variation) return null;

      const stock = variation.stock || 0;

      return {
        ...item.toObject(),
        stock,
        isOutOfStock: stock === 0 || item.quantity > stock
      };
    })
  );

  const cleanedItems = updatedItems.filter(Boolean);

  cart.items = cleanedItems;

  const subtotal = cleanedItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );

  cart.finalAmount = subtotal - (cart.discountAmount || 0);

  await cart.save();

  return {
    ...cart.toObject(),
    items: cleanedItems
  };
}
  
}

module.exports = CartService;
