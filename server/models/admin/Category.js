const mongoose = require("mongoose");

const allowedAttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    values: {
      type: [String],
      required: true
    }
  },
  { _id: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3]
    },
    isLeaf: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    allowedAttributes: {
      type: [allowedAttributeSchema],
      default: undefined,
      validate: {
        validator: function (arr) {
          if (this.level === 2) {
            return Array.isArray(arr) && arr.length > 0;
          }
          return true;
        },
        message: "Level 2 categories must have allowedAttributes"
      }
    }
  },
  { timestamps: true }
);

categorySchema.index({ parentId: 1 });

module.exports = mongoose.model("Category", categorySchema);

 
