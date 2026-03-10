const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const WishlistController = require("../controllers/user/userWishlistController");

const router = express.Router();

// Get wishlist items (with optional pagination: ?page=1&limit=10)
router.get("/get-wishlist", authenticateUser, WishlistController.getWishlist);

// Add a product to wishlist
router.post("/add-wishlist", authenticateUser, WishlistController.addToWishlist);

// Remove a product from wishlist
router.delete("/remove-wishlist/:productId", authenticateUser, WishlistController.removeFromWishlist);

// Move a product from wishlist to cart
router.post("/move-to-cart", authenticateUser, WishlistController.moveToCart);

module.exports = router;
