const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  name: String, 
  price: Number, 
  quantity: Number,

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }

}, { _id: false });



const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [orderItemSchema],

  subtotal: {
    type: Number,
    required: true
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon"
  },

  totalAmount: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  orderStatus: {
    type: String,
    enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PLACED"
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    postalCode: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
