const CartService = require("../../services/CartService");
const BaseController = require("../BaseController");


class CartController extends BaseController {

  static addToCart = BaseController.asyncHandler(async (req, res) => {
    const { productId, variationId, name, brandName, image, price, mrp, discountPercentage, size, color, quantity } = req.body;
    const userId = req.user._id;

    const cartItem = {
      productId,
      variationId,
      name,
      brandName,
      image,
      price,
      mrp,
      discountPercentage,
      size,
      color,
      quantity,
    };

    const result = await CartService.addToCart(userId, cartItem);

    BaseController.logAction("ITEM ADDED TO CART", result);
    BaseController.sendSuccess(res, "ITEM ADDED TO CART", result);
  });

 
  static mergeCart = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const guestCart = req.body.guestCart || [];
    console.log("from merge cart",req.body)

    if (guestCart.length === 0) return BaseController.sendSuccess(res, "NO GUEST CART TO MERGE", []);

    const result = await CartService.mergeCart(userId, guestCart);

    BaseController.logAction("GUEST CART MERGED", result);
    BaseController.sendSuccess(res, "GUEST CART MERGED", result);
  });


  static removeFromCart = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { variationId } = req.params;

    const result = await CartService.removeFromCart(userId, variationId);

    BaseController.logAction("ITEM REMOVED FROM CART", result);
    BaseController.sendSuccess(res, "ITEM REMOVED FROM CART", result);
  });

 
  static updateCartQuantity = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
     const variationId = req.params.variationId;
     console.log("variation id" ,variationId)
    const { quantity } = req.body;

    const result = await CartService.updateCartQuantity(userId, variationId, quantity);

    BaseController.logAction("CART ITEM QUANTITY UPDATED", result);
    BaseController.sendSuccess(res, "CART ITEM QUANTITY UPDATED", result);
  });


  static getCart = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await CartService.getCart(userId);

    BaseController.logAction("USER CART FETCHED", result);
    BaseController.sendSuccess(res, "USER CART FETCHED", result);
  });

}

module.exports = CartController;
