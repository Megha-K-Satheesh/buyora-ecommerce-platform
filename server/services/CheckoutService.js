const mongoose = require("mongoose");
const Coupon = require("../models/admin/Coupon");
const Cart = require("../models/Cart");
const { ErrorFactory } = require("../utils/errors");
const Address = require("../models/Address");
const Order = require("../models/Order");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Wallet = require("../models/Wallet");
class CheckoutService {
  static async getOrderSummary(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw ErrorFactory.validation("Invalid user ID");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    let subtotal = 0;
    let totalDiscount = 0;

    cart.items.forEach(item => {
      subtotal += item.mrp * item.quantity;
      totalDiscount += (item.mrp - item.price) * item.quantity;
    });

    let couponDiscount = 0;

    if (cart.appliedCouponId) {
      const coupon = await Coupon.findById(cart.appliedCouponId);
      if (coupon) {
        if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
          if (coupon.discount.type === "PERCENTAGE") {
            couponDiscount = (subtotal * coupon.discount.value) / 100;
          } else if (coupon.discount.type === "FLAT") {
            couponDiscount = coupon.discount.value;
          }

          if (coupon.discount.maxDiscount) {
            couponDiscount = Math.min(couponDiscount, coupon.discount.maxDiscount);
          }
        } else {
          couponDiscount = 0;
        }
      } else {
        cart.appliedCouponId = null;
        cart.appliedCouponCode = null;
      }
    }

    const finalAmount = Math.max(subtotal - totalDiscount - couponDiscount, 0);

    cart.discountAmount = couponDiscount;
    cart.finalAmount = finalAmount;
    await cart.save();

    return {
      items: cart.items,
      appliedCoupon: cart.appliedCouponCode || null,
      discountAmount: couponDiscount,
      subtotal,
      totalDiscount,
      finalAmount
    };
  }



  


   static async placeOrder(userId, data) {
    const { addressId, paymentMethod } = data;

    if (!mongoose.Types.ObjectId.isValid(userId)) throw ErrorFactory.validation("Invalid user ID");
    if (!["COD", "ONLINE", "WALLET"].includes(paymentMethod)) throw ErrorFactory.validation("Invalid payment method");

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) throw ErrorFactory.validation("Cart is empty");

    const address = await Address.findById(addressId);
    if (!address) throw ErrorFactory.validation("Address not found");

    let subtotal = 0;
    let totalDiscount = 0;

    cart.items.forEach(item => {
      subtotal += item.mrp * item.quantity;
      totalDiscount += (item.mrp - item.price) * item.quantity;
    });

    const finalAmount = Math.max(subtotal - totalDiscount - (cart.discountAmount || 0), 0);

  

    const now = new Date();

const orderItems = cart.items.map(item => ({
  productId: item.productId,
    variantId: item.variationId || null,
  name: item.name,
  price: item.price,
  mrp:item.mrp,
  quantity: item.quantity,
  categoryId: item.categoryId || null,
  status: "PLACED",
confirmAt: null,
shippedAt: null,
deliveredAt: null, 
   expectedDeliveryDate: new Date(now.getTime() + 3*24*60*60*1000) 
}));

    const order = new Order({
  userId,
  items: orderItems,
  subtotal,
  discountAmount: cart.discountAmount || 0,
  couponId: cart.appliedCouponId || null,
  totalAmount: finalAmount,
  paymentMethod,
  paymentStatus: "PENDING",
  // orderStatus: "PLACED",
  orderStatus: paymentMethod === "ONLINE" 
    ? "PENDING_PAYMENT" 
    : "PLACED",
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
   
    //wallet pay

   if (paymentMethod === "WALLET") {

  // find user wallet
  let wallet = await Wallet.findOne({ userId });

  // create wallet if not exists
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
      transactions: []
    });
  }

  // check wallet balance
  if (wallet.balance < finalAmount) {
    throw ErrorFactory.validation(
      `Insufficient wallet balance. Available: ₹${wallet.balance}`
    );
  }

  // deduct wallet balance
  wallet.balance -= finalAmount;

  // add wallet transaction
  wallet.transactions.push({
    type: "DEBIT",
    amount: finalAmount,
    reason: "Order Payment",
    orderId: order._id,
    createdAt: new Date()
  });

  await wallet.save();

  // update order payment status
  order.paymentStatus = "PAID";
  order.orderStatus = "PLACED";

  await order.save();

  // clear cart
  cart.items = [];
  cart.appliedCouponId = null;
  cart.appliedCouponCode = null;
  cart.discountAmount = 0;

  await cart.save();

  return {
    order,
    paymentRequired: false
  };
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
  
if (order.orderStatus === "PENDING_PAYMENT") {
  order.orderStatus = "PLACED";
}


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
