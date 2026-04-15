const mongoose = require("mongoose");
const Coupon = require("../models/admin/Coupon");
const Cart = require("../models/Cart");
const { ErrorFactory } = require("../utils/errors");
const Address = require("../models/Address");
const Order = require("../models/Order");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Wallet = require("../models/Wallet");
const Product = require('../models/admin/Product');
class CheckoutService {




static async getOrderSummary(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ErrorFactory.validation("Invalid user ID");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const products = await Product.find({
    _id: { $in: cart.items.map(i => i.productId) }
  }).lean();

  const productMap = new Map(products.map(p => [p._id.toString(), p]));

  const enrichedItems = cart.items.map(item => {
    const product = productMap.get(item.productId.toString());

    return {
      ...item.toObject(),
      categoryId: product?.category || null
    };
  });

  let mrpSubtotal = 0;
  let sellingSubtotal = 0;

  enrichedItems.forEach(item => {
    mrpSubtotal += item.mrp * item.quantity;
    sellingSubtotal += item.price * item.quantity;
  });

  const productDiscount = mrpSubtotal - sellingSubtotal;

  const couponDiscount = cart.discountAmount || 0;
  const appliedCouponCode = cart.appliedCouponCode || null;

  const totalDiscount = productDiscount + couponDiscount;

  const finalAmount = Math.max(
    sellingSubtotal - couponDiscount,
    0
  );

  return {
    items: enrichedItems,
    mrpSubtotal,
    subtotal: sellingSubtotal,
    productDiscount,
    couponDiscount,
    totalDiscount,
    appliedCoupon: appliedCouponCode,
    finalAmount
  };
}













static async placeOrder(userId, data) {
  const { addressId, paymentMethod } = data;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ErrorFactory.validation("Invalid user ID");
  }

  if (!["COD", "ONLINE", "WALLET"].includes(paymentMethod)) {
    throw ErrorFactory.validation("Invalid payment method");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw ErrorFactory.validation("Cart is empty");
  }

  const address = await Address.findById(addressId);
  if (!address) {
    throw ErrorFactory.validation("Address not found");
  }

  const products = await Product.find({
    _id: { $in: cart.items.map(i => i.productId) }
  }).lean();

  const productMap = new Map(products.map(p => [p._id.toString(), p]));

  const enrichedCartItems = cart.items.map(item => {
    const product = productMap.get(item.productId.toString());

    if (!product) {
      throw ErrorFactory.notFound("Product not found");
    }

    if (product.totalStock < item.quantity) {
      throw ErrorFactory.validation(`Insufficient stock for ${product.name}`);
    }

    return {
      ...item.toObject(),
      categoryId: product.category || null
    };
  });

  let mrpSubtotal = 0;
  let subtotal = 0;

  enrichedCartItems.forEach(item => {
    mrpSubtotal += item.mrp * item.quantity;
    subtotal += item.price * item.quantity;
  });

  const couponDiscount = cart.discountAmount || 0;
  const couponId = cart.appliedCouponId || null;
  const couponCode = cart.appliedCouponCode || null;

  let couponType = "NONE";
  let couponValue = 0;
  let couponScope = "GLOBAL";
  let eligibleCategories = [];
  let couponAppliedAmount = 0;

  let globalDiscount = 0;
  let categoryDiscount = 0;

  let coupon = null;

  if (couponId) {
    coupon = await Coupon.findById(couponId);

    if (coupon && couponDiscount > 0) {
      couponType = coupon.discount.type;
      couponValue = coupon.discount.value;
      couponScope = coupon.scope || "GLOBAL";
      eligibleCategories = coupon.applicableCategories || [];
      couponAppliedAmount = couponDiscount;

      if (couponScope === "GLOBAL") {
        globalDiscount = couponDiscount;
      } else {
        categoryDiscount = couponDiscount;
      }
    }
  }

  const finalAmount = Math.max(subtotal - couponDiscount, 0);

  const now = new Date();

  const orderItems = enrichedCartItems.map(item => ({
    productId: item.productId,
    variationId: item.variationId || null,
    name: item.name,
    price: item.price,
    mrp: item.mrp,
    quantity: item.quantity,
    categoryId: item.categoryId,
    status: "PLACED",
    confirmAt: null,
    shippedAt: null,
    deliveredAt: null,
    expectedDeliveryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  }));

  const order = new Order({
    userId,
    items: orderItems,
    subtotal,
    mrpSubtotal,
    discountAmount: couponDiscount,
    couponId,
    couponCode,
    couponType,
    couponValue,
    couponScope,
    eligibleCategories,
    couponAppliedAmount,
    couponBreakup: {
      globalDiscount,
      categoryDiscount
    },
    totalAmount: finalAmount,
    paymentMethod,
    paymentStatus: "PENDING",
    orderStatus: paymentMethod === "ONLINE" ? "PENDING_PAYMENT" : "PLACED",
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      postalCode: address.pinCode
    }
  });

  await order.save();

  if (paymentMethod === "COD") {
    cart.items = [];
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    await cart.save();

    return { order, paymentRequired: false };
  }

  if (paymentMethod === "ONLINE") {
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: order._id.toString()
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return {
      order,
      paymentRequired: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    };
  }

  if (paymentMethod === "WALLET") {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        transactions: []
      });
    }

    if (wallet.balance < finalAmount) {
      throw ErrorFactory.validation("Insufficient wallet balance");
    }

    wallet.balance -= finalAmount;

    wallet.transactions.push({
      type: "DEBIT",
      amount: finalAmount,
      reason: "Order Payment",
      orderId: order._id,
      createdAt: new Date()
    });

    await wallet.save();

    order.paymentStatus = "PAID";
    order.orderStatus = "PLACED";
    await order.save();

    cart.items = [];
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    await cart.save();

    return { order, paymentRequired: false };
  }
}


static async verifyPayment(userId, body) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    throw ErrorFactory.validation("Payment verification failed");
  }

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw ErrorFactory.notFound("Order not found");

  order.paymentStatus = "PAID";
  order.orderStatus = "PLACED";

  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;

  await order.save();

  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = [];
    cart.appliedCouponId = null;
    cart.appliedCouponCode = null;
    cart.discountAmount = 0;
    await cart.save();
  }

  return order;
}



}

module.exports = CheckoutService;
