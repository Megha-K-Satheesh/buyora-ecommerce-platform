 
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinaryConfig");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { ErrorFactory } = require("../utils/errors");

class ReviewService {




  static async addReview({ userId, productId, body, files }) {
  const { rating, comment } = body;

const order = await Order.findOne({
  userId: new mongoose.Types.ObjectId(userId),
  "items.productId": new mongoose.Types.ObjectId(productId),
});
console.log(order)
if (!order) {
  
  throw ErrorFactory.conflict("You can only review products you have purchased");
}

  const hasPurchased = await Order.findOne({
  userId: new mongoose.Types.ObjectId(userId),
  items: {
    $elemMatch: {
      productId: new mongoose.Types.ObjectId(productId),
      status: "DELIVERED",
    },
  },
});

if (!hasPurchased) {
  throw  ErrorFactory.conflict("Please wait until your order is delivered to add a review");
}




  const images = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reviews" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      images.push(result.secure_url);
    }
  }

 
  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
    images,
  });


  const reviews = await Review.find({ product: productId });
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

 
  return {
    review,
    stats: {
      totalReviews,
      avgRating: avgRating.toFixed(1),
      ratingCounts,
    },
  };
}
 


  static async getReviews(productId) {
  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRatings = 0;

  for (const review of reviews) {
    const rating = review.rating;
    sumRatings += rating;
    if (ratingCounts[rating] !== undefined) {
      ratingCounts[rating] += 1;
    }
  }

  const avgRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : 0;

  return {
    reviews,
    stats: {
      totalReviews,
      avgRating,
      ratingCounts,
    },
  };
}


static async toggleLike({ reviewId, userId }) {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  const alreadyLiked = review.likes.some(
    (id) => id.toString() === userId
  );

  if (alreadyLiked) {
    review.likes.pull(userId);
  } else {
    review.likes.push(userId);
  }

  await review.save();

  return {
    reviewId: review._id,
    likes: review.likes,
  };
}

static async deleteReview({ reviewId, userId }) {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");


  if (review.user.toString() !== userId) {
    throw new Error("You can delete only your review");
  }

  if (review.images && review.images.length > 0) {
    for (const imageUrl of review.images) {
      const publicId = imageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }
  }

  await Review.findByIdAndDelete(reviewId);

  return { message: "Your review deleted successfully" };
}
}

module.exports = ReviewService;
