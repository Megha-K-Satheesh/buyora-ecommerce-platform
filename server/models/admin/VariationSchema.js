const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema(
  {
    attributes: {
      type: Map,
      of: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    // sku: {
    //   type: String
    // },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);

module.exports = variationSchema;
