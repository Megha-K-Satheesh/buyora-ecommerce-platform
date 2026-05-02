
const ReviewService = require("../../services/ReviewService");
const { createReviewValidation, productIdValidation } = require("../../utils/validation");
const BaseController = require("../BaseController");


class ReviewController extends BaseController {

  
  static addReview = BaseController.asyncHandler(async (req, res) => {
      BaseController.validateRequest(productIdValidation, req.params);

 
  const validatedBody = BaseController.validateRequest(
    createReviewValidation,
    req.body
  );
  const result = await ReviewService.addReview({
    userId: req.user.id,
    productId: req.params.productId,
    body: validatedBody,
    files: req.files
  });

    BaseController.logAction("REVIEW ADDED", result);
    BaseController.sendSuccess(res, "REVIEW ADDED", result);
  });

  
  static getReviews = BaseController.asyncHandler(async (req, res) => {
    const result = await ReviewService.getReviews(req.params.productId);

    BaseController.logAction("REVIEWS FETCHED", result);
    BaseController.sendSuccess(res, "REVIEWS FETCHED", result);
  });

 
  static toggleLike = BaseController.asyncHandler(async (req, res) => {
    const result = await ReviewService.toggleLike({
      reviewId: req.params.reviewId,
      userId: req.user.id
    });

    BaseController.logAction("REVIEW LIKE TOGGLED", result);
    BaseController.sendSuccess(res, "REVIEW UPDATED", result);
  });




static deleteReview = BaseController.asyncHandler(async (req, res) => {
  const result = await ReviewService.deleteReview({
    reviewId: req.params.reviewId,
    userId: req.user.id
  });

  BaseController.logAction("REVIEW DELETED", result);
  BaseController.sendSuccess(res, "REVIEW DELETED", result);
});
}

module.exports = ReviewController;
