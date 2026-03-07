
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  name: String,

  price: {
    type: Number,
    required: true
  },

  mrp: Number,

  quantity: {
    type: Number,
    required: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  status: {
    type: String,
    enum: [
      "PLACED",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURN_REQUESTED",
      "RETURN_APPROVED",
      "RETURN_REJECTED",
   
    "RETURN_REJECTED",
      "RETURNED"
    ],
    default: "PLACED"
  },

  expectedDeliveryDate: Date,

  confirmAt: Date,
  shippedAt: Date,
  deliveredAt: Date,

  cancelReason: String,

  returnReason: String,

  returnRequestedAt: Date,

  returnedAt: Date,

  refundStatus: {
    type: String,
    enum: ["NONE", "PENDING", "REFUNDED"],
    default: "NONE"
  },

  refundAmount: {
    type: Number,
    default: 0
  },

  refundMethod: {
    type: String,
    enum: ["WALLET", "RAZORPAY", "NONE"],
    default: "NONE"
  },

  refundProcessedAt: Date

}, { timestamps: true });




const orderSchema = new mongoose.Schema({

  orderNumber: {
    type: String,
    unique: true
  },

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

  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
    default: "PENDING"
  },

  orderStatus: {
    type: String,
     enum: [
    "PENDING_PAYMENT",
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "PARTIALLY_CANCELLED",
    "PARTIALLY_RETURNED",
    "RETURNED"
  ],
    default: "PLACED"
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    postalCode: String
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  refundSummary: {
    totalRefundedAmount: {
      type: Number,
      default: 0
    }
  }

}, { timestamps: true });



orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${nanoid(8).toUpperCase()}`;
  }
  next();
});


module.exports = mongoose.model("Order", orderSchema);
