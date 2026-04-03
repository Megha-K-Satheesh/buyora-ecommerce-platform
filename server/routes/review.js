const express = require("express");
const upload = require("../middlewares/upload");
const ReviewController = require("../controllers/user/userReviewController");
const { authenticateUser, authenticateAdmin } = require("../middlewares/auth");



const router = express.Router()

router.post("/:productId", authenticateUser, upload.array("images"), ReviewController.addReview);
router.get("/:productId", ReviewController.getReviews);
router.patch("/:reviewId/like", authenticateUser, ReviewController.toggleLike);
router.delete("/:reviewId", authenticateUser, ReviewController.deleteReview);
module.exports = router;
