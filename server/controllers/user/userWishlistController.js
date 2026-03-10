const BaseController = require("../BaseController");
const WishlistService = require("../../services/WishlistService");
const CartService = require("../../services/CartService"); 

class WishlistController extends BaseController {

  
  static addToWishlist = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    const result = await WishlistService.addToWishlist(userId, productId);

    BaseController.logAction("ITEM ADDED TO WISHLIST", { userId, productId });
    BaseController.sendSuccess(res, "ITEM ADDED TO WISHLIST", result);
  });


  static removeFromWishlist = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const result = await WishlistService.removeFromWishlist(userId, productId);

    BaseController.logAction("ITEM REMOVED FROM WISHLIST", { userId, productId });
    BaseController.sendSuccess(res, "ITEM REMOVED FROM WISHLIST", result);
  });


  static getWishlist = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const result = await WishlistService.getWishlist(userId, { page, limit });

    BaseController.logAction("USER WISHLIST FETCHED", { userId, page, limit });
    BaseController.sendSuccess(res, "USER WISHLIST FETCHED", result);
  });






  
static moveToCart = BaseController.asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, variationId, size, color, quantity = 1 } = req.body;

  if (!productId || !variationId) {
    return BaseController.sendError(res, 400, "ProductId and VariationId are required");
  }

 
  await WishlistService.moveToCart(
    userId,
    { productId, variationId, size, color, quantity },
    CartService
  );

  BaseController.logAction("ITEM MOVED TO CART", { userId, productId, variationId, size, color });
  BaseController.sendSuccess(res, "ITEM MOVED TO CART", { productId, variationId, size, color });
});
}

module.exports = WishlistController;
