const Category = require("../models/admin/Category");
const Coupon = require("../models/admin/Coupon");
const Cart = require("../models/Cart")
const couponUsage = require("../models/admin/couponUsage");
const Order = require("../models/Order");
const { ErrorFactory } = require("../utils/errors");


class UserCouponService {

      

     static async verifyCoupon({ code, cartItems, cartTotal, userId }) {

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      throw ErrorFactory.notFound("Invalid coupon code");
    }

    if (!coupon.isActive) {
      throw ErrorFactory.validation("Coupon is inactive");
    }

    const now = new Date();

    if (now < coupon.validFrom || now > coupon.validTill) {
      throw ErrorFactory.validation("Coupon is not valid at this time");
    }

    if (cartTotal < coupon.minOrderAmount) {
      throw ErrorFactory.validation(
        `Minimum order amount is ${coupon.minOrderAmount}`
      );
    }


    if (
      coupon.totalUsageLimit &&
      coupon.usedCount >= coupon.totalUsageLimit
    ) {
      throw ErrorFactory.validation("Coupon usage limit reached");
    }

    
    if (coupon.isFirstOrderOnly && userId) {
      const existingOrder = await Order.findOne({ userId });
      if (existingOrder) {
        throw ErrorFactory.validation("Coupon valid only for first order");
      }
    }

    
    if (userId && coupon.usageLimitPerUser) {

      const usage = await couponUsage.findOne({
        userId,
        couponId: coupon._id
      });

      if (usage && usage.usedCount >= coupon.usageLimitPerUser) {
        throw ErrorFactory.validation("You have already used this coupon maximum times");
      }
    }

  
   const Product = require("../models/admin/Product");


if (coupon.scope === "CATEGORY") {

  //  Get variation ids from cart
  const variationIds = cartItems.map(item => item.variationId);

  // Get product categories (Level 3)
  const products = await Product.find({
    "variations._id": { $in: variationIds }
  }).select("category").lean();

  //  Load all categories once
  const categories = await Category.find().lean();

  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat._id.toString()] = cat;
  });

  // Collect all parent categories for each product
  let cartAllCategoryIds = [];

  for (let product of products) {

    let current = categoryMap[product.category.toString()];

    while (current) {
      cartAllCategoryIds.push(current._id.toString());

      if (!current.parentId) break;

      current = categoryMap[current.parentId.toString()];
    }
  }

  //  Check if coupon category matches any level
  const couponCategoryIds = coupon.applicableCategories.map(id =>
    id.toString()
  );

  const isApplicable = couponCategoryIds.some(id =>
    cartAllCategoryIds.includes(id)
  );

  if (!isApplicable) {
    throw ErrorFactory.validation("Coupon not applicable to selected products");
  }
}
  
    let discountAmount = 0;

    if (coupon.discount.type === "FLAT") {
      discountAmount = coupon.discount.value;
    } else {
      discountAmount = (cartTotal * coupon.discount.value) / 100;

      // Apply max discount cap
      if (coupon.discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.discount.maxDiscount);
      }
    }

    const finalAmount = Math.max(cartTotal - discountAmount, 0);

   

    console.log("This is the userId", userId)
    if (userId) {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw ErrorFactory.notFound("Cart not found");
  }

  cart.appliedCouponId = coupon._id;   
  cart.appliedCouponCode = coupon.code;   
  cart.discountAmount = discountAmount; 
  cart.finalAmount = finalAmount;     

  await cart.save();
}



    return {
      couponId: coupon._id,
        appliedCoupon:coupon.code,
      discountAmount,
      finalAmount
    };
  }


  static async removeCoupon(userId) {
      //  Find cart
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      // Clear coupon fields
      cart.appliedCouponId = null;
      cart.appliedCouponCode = null;
      cart.discountAmount = 0;
  
      //  Recalculate totals
      const totalMRP = cart.items.reduce(
        (acc, item) => acc + item.mrp * item.quantity,
        0
      );
  
      const totalDiscount = cart.items.reduce(
        (acc, item) =>
          acc + (item.mrp - item.price) * item.quantity,
        0
      );
  
      cart.finalAmount = totalMRP - totalDiscount;
  
      await cart.save();
  
      return {
        items: cart.items,
        appliedCoupon: null,
        discountAmount: 0,
        finalAmount: cart.finalAmount
      };
    }


  
}

module.exports = UserCouponService
