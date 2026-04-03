import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["hero", "promo", "category", "offer"],
      required: true,
    },
    page: {
      type: String,
      enum: ["home", "men", "women", "kids"],
      required: true,
    },
    section: {
      type: String,
      enum: [
        "home_top",
       "home_bags",
  "home_watches",
        "home_explore",
        "home_trending",
        "home_slider",
        "category_top",
        "category_slider"
      ],
      required: true,
    },
    sliderId: {
      type: String,
    },
    redirectType: {
      type: String,
      enum: ["category", "product", "brand", "url"],
    },
    redirectValue: {
      type: String,
    },
    discountText: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ page: 1, section: 1, isActive: 1, order: 1 });

export default mongoose.model("Banner", bannerSchema);
