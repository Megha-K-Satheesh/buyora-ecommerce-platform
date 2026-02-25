
const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
    index: true
  },

  usedCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

couponUsageSchema.index({ userId: 1, couponId: 1 }, { unique: true });

module.exports = mongoose.model("CouponUsage", couponUsageSchema);
