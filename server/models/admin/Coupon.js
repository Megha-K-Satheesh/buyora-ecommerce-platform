const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,
    trim: true,
    index: true
  },

  description: {
    type: String,
    trim: true
  },

  discount: {
    type: {
      type: String,
      enum: ["FLAT", "PERCENTAGE"],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    maxDiscount: {
      type: Number,
      min: 0
    }
  },

  scope: {
    type: String,
    enum: ["GLOBAL", "CATEGORY"],
    default: "GLOBAL",
    required: true
  },

  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],

  // applicableProducts: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Product"
  // }],

  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  totalUsageLimit: {
    type: Number,
    min: 1
  },

  usedCount: {
    type: Number,
    default: 0
  },

  usageLimitPerUser: {
    type: Number,
    default: 1,
    min: 1
  },

  isFirstOrderOnly: {
    type: Boolean,
    default: false
  },

  validFrom: {
    type: Date,
    required: true
  },

  validTill: {
    type: Date,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });
couponSchema.index({ code: 1, isActive: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
