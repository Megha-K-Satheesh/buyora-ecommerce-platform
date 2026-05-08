
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
variantId: {                 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",             
    default: null
  },

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

originalDiscount: {
  type: Number,
  default: 0
},
couponScope: {
  type: String,
  enum: ["GLOBAL", "CATEGORY"],
  default: "GLOBAL"
},

eligibleCategories: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category"
}],
couponType: {
  type: String,
  enum: ["FLAT", "PERCENTAGE", "NONE"],
  default: "NONE"
},

couponValue: {
  type: Number,
  default: 0
},
couponBreakup: {
  globalDiscount: { type: Number, default: 0 },
  categoryDiscount: { type: Number, default: 0 }
},
couponAppliedAmount: {
  type: Number,
  default: 0
},
mrpSubtotal: {
  type: Number,
  required: true
},
  totalAmount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE","WALLET"],
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
    "PARTIALLY_SHIPPED",
    "SHIPPED",
    "PARTIALLY_DELIVERED",
    "DELIVERED",
    "PARTIALLY_CANCELLED",
    "CANCELLED",
"PARTIALLY_CONFIRMED",
    "PARTIALLY_RETURN_REQUESTED",
    "RETURN_REQUESTED",
    "RETURN_APPROVED",
    "PARTIALLY_RETURN_APPROVED",
    "PARTIALLY_RETURNED",
    "RETURNED",
  "PAYMENT_FAILED"
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



orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${nanoid(8).toUpperCase()}`;
  }
  
});


module.exports = mongoose.model("Order", orderSchema);
