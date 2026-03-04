const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // unique variant (size/color)
  },
  name: { type: String, required: true },
  brandName: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
    // appliedCoupon: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Coupon",
    //   default: null
    // },
appliedCouponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
  appliedCouponCode: { type: String, default: null },
    discountAmount: {
  type: Number,
  default: 0
},
finalAmount: {
  type: Number,
  default: 0
}
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Cart", CartSchema);
