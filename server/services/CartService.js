// const mongoose = require("mongoose");
// const Cart = require("../models/Cart");
// const { ErrorFactory } = require("../utils/errors");
// const Product = require("../models/admin/Product");
// const Coupon = require("../models/admin/Coupon");
// class CartService {


// static async recalculateCart(cart) {
//   // 1️⃣ Calculate subtotal
//   const subtotal = cart.items.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   let couponDiscount = 0;

//   // 2️⃣ Apply coupon only if valid
//   if (cart.appliedCouponId) {
//     const coupon = await Coupon.findById(cart.appliedCouponId);

//     if (!coupon) {
//       // ❌ Coupon no longer exists → clear it
//       cart.appliedCouponId = null;
//       cart.appliedCouponCode = null;
//       couponDiscount = 0;
//     } else if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
//       // ❌ Subtotal too low → keep coupon but discount 0 (optional: clear coupon if you want)
//       couponDiscount = 0;
//     } else {
//       // ✅ Coupon valid → calculate discount
//       if (coupon.type === "PERCENTAGE") couponDiscount = (subtotal * coupon.value) / 100;
//       if (coupon.type === "FLAT") couponDiscount = coupon.value;

//       // Optional: enforce max discount if your coupon has it
//       if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
//     }
//   }

//   // 3️⃣ Save computed values
//   cart.discountAmount = couponDiscount;
//   cart.finalAmount = Math.max(subtotal - couponDiscount, 0);
// }







//   static async addToCart(userId, cartItem) {
//     // console.log(cartItem,userId)
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       throw ErrorFactory.validation("Invalid user ID");
//     }
//     if (!cartItem.productId || !cartItem.variationId) {
//       throw ErrorFactory.validation("ProductId and VariationId are required");
//     }

//     const product = await Product.findById(cartItem.productId);
//     if (!product) throw ErrorFactory.notFound("Product not found");

//     const variationExists = product.variations.some(v => v._id.equals(cartItem.variationId));
//     if (!variationExists) throw ErrorFactory.validation("Invalid variation for this product");

//     let cart = await Cart.findOne({ userId });

    
//     const existingItem = cart.items.find(
//   x =>
//     x.productId.equals(cartItem.productId) &&
//     x.variationId.equals(cartItem.variationId)
// );


//     if (existingItem) {
//       existingItem.quantity += cartItem.quantity || 1;
//     } else {
//       cart.items.push(cartItem);
//     }
//      await this.recalculateCart(cart)
//     await cart.save();
//     return {
//       items: cart.items || [],
//       appliedCoupon: cart.appliedCouponCode || null,
//       discountAmount: cart.discountAmount || 0,
//       finalAmount: cart.finalAmount || 0
//     };
//   }

// static async mergeCart(userId, guestCart = []) {
//   if (!guestCart || guestCart.length === 0) {
//     throw ErrorFactory.notFound("guestCart not found");
//   }
//   console.log("hi")
  
  
//   const cart = await Cart.findOne({ userId }) || await Cart.create({ userId, items: [] });
//   console.log(cart)
  
//   const normalizedGuestCart = guestCart.map(item => ({
//     ...item,
//     productId: new mongoose.Types.ObjectId(item.productId),
//     variationId: new mongoose.Types.ObjectId(item.variationId),
//   }));

//   for (const item of normalizedGuestCart) {

// const existingItem = cart.items.find(
//   x => x.variationId.equals(item.variationId)
// );

//     if (existingItem) {
//       existingItem.quantity += item.quantity || 1;
//     } else {
//       cart.items.push(item);
//     }
//   }

 
// await this.recalculateCart(cart);
//   await cart.save();
//   // Return formatted response
//   return {
//     items: cart.items || [],
//     appliedCoupon: cart.appliedCouponCode || null,
//     discountAmount: cart.discountAmount || 0,
//     finalAmount: cart.finalAmount || 0
//   };
// }



  


//   static async removeFromCart(userId, variationId) {
//   const cart = await Cart.findOne({ userId });
//   if (!cart) {
//     throw ErrorFactory.notFound("Cart not found");
//   }

//   const varId = new mongoose.Types.ObjectId(variationId);

//   cart.items = cart.items.filter(
//     x => !x.variationId.equals(varId)
//   );

//   await this.recalculateCart(cart);

//   await cart.save();

//   return {
//     items: cart.items || [],
//     appliedCoupon: cart.appliedCouponCode || null,
//     discountAmount: cart.discountAmount || 0,
//     finalAmount: cart.finalAmount || 0
//   };
// }

  

//   static async updateCartQuantity(userId, variationId, quantity) {
//   if (quantity < 1) {
//     throw ErrorFactory.validation("Quantity must be at least 1");
//   }

//   const cart = await Cart.findOne({ userId });
//   if (!cart) {
//     throw ErrorFactory.notFound("Cart not found");
//   }

//   const varId = new mongoose.Types.ObjectId(variationId);
//   const item = cart.items.find(x => x.variationId.equals(varId));

//   if (!item) {
//     throw ErrorFactory.notFound("Cart item not found");
//   }

//   item.quantity = quantity;

//  await this.recalculateCart(cart);

//   await cart.save();

//   return {
//     items: cart.items || [],
//     appliedCoupon: cart.appliedCouponCode || null,
//     discountAmount: cart.discountAmount || 0,
//     finalAmount: cart.finalAmount || 0
//   };
// }


  

//   static async getCart(userId) {
//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//     cart = await Cart.create({ userId, items: [] });
//   }

 
//   const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
//   cart.finalAmount = Math.max(subtotal - cart.discountAmount, 0);

//   await cart.save();

//   return {
//     items: cart.items || [],
//     appliedCoupon: cart.appliedCouponCode || null,
//     discountAmount: cart.discountAmount || 0,
//     finalAmount: cart.finalAmount || 0
//   };
// }
// }

// module.exports = CartService;




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

    const variationExists = product.variations.some(v =>
      v._id.equals(cartItem.variationId)
    );
    if (!variationExists) throw ErrorFactory.validation("Invalid variation for this product");

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const existingItem = cart.items.find(
      x => x.productId.equals(cartItem.productId) && x.variationId.equals(cartItem.variationId)
    );

    if (existingItem) existingItem.quantity += cartItem.quantity || 1;
    else cart.items.push(cartItem);

    // Clear applied coupon because cart changed
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    cart.finalAmount = 0;

    await cart.save();
    return cart;
  }



  static async mergeCart(userId, guestCart = []) {
    if (!guestCart || guestCart.length === 0) {
      return await CartService.getCart(userId); // nothing to merge
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    // Convert guestCart item IDs to ObjectId
    const normalizedGuestCart = guestCart.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
      variationId: new mongoose.Types.ObjectId(item.variationId),
    }));

    for (const guestItem of normalizedGuestCart) {
      const existingItem = cart.items.find(
        x => x.variationId.equals(guestItem.variationId)
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity || 1;
      } else {
        cart.items.push(guestItem);
      }
    }

    // Clear coupon after merging
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    cart.finalAmount = 0;

    await cart.save();

    // Return clean object for Redux
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

    // Clear coupon because cart changed
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    cart.finalAmount = 0;

    await cart.save();
    return cart;
  }

  static async updateCartQuantity(userId, variationId, quantity) {
    if (quantity < 1) throw ErrorFactory.validation("Quantity must be at least 1");

    const cart = await Cart.findOne({ userId });
    if (!cart) throw ErrorFactory.notFound("Cart not found");

    const item = cart.items.find(x => x.variationId.equals(variationId));
    if (!item) throw ErrorFactory.notFound("Cart item not found");

    item.quantity = quantity;

    // Clear coupon because quantity changed
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    cart.finalAmount = 0;

    await cart.save();
    return cart;
  }

  static async getCart(userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    // Compute subtotal for display
    const subtotal = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cart.finalAmount = subtotal - (cart.discountAmount || 0);

    await cart.save();
    return cart;
  }


  
}

module.exports = CartService;
