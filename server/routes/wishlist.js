const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const WishlistController = require("../controllers/user/userWishlistController");

const router = express.Router();


router.get("/get-wishlist", authenticateUser, WishlistController.getWishlist);


router.post("/add-wishlist", authenticateUser, WishlistController.addToWishlist);


router.delete("/remove-wishlist/:productId", authenticateUser, WishlistController.removeFromWishlist);


router.post("/move-to-cart", authenticateUser, WishlistController.moveToCart);

module.exports = router;
