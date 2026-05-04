const CartService = require("../../services/CartService");
const { addToCartValidation, mergeCartValidation, updateCartQuantityValidation, variationIdParamValidation } = require("../../utils/cartValidation");
const BaseController = require("../BaseController");


class CartController extends BaseController {

  static addToCart = BaseController.asyncHandler(async (req, res) => {
  
console.log("RAW BODY:", req.body);
    const validatedData = BaseController.validateRequest(addToCartValidation,req.body)
    const userId = req.user._id;
   
console.log("vvvvccc",validatedData)


    const result = await CartService.addToCart(userId, validatedData);

    BaseController.logAction("ITEM ADDED TO CART", result);
    BaseController.sendSuccess(res, "ITEM ADDED TO CART", result);
  });

 

static mergeCart = BaseController.asyncHandler(async (req, res) => {

  const validatedData = BaseController.validateRequest(
    mergeCartValidation,
    req.body
  );

  const userId = req.user._id;

  if (validatedData.guestCart.length === 0)
    return BaseController.sendSuccess(res, "NO GUEST CART TO MERGE", []);

  const result = await CartService.mergeCart(userId, validatedData.guestCart);

  BaseController.logAction("GUEST CART MERGED", result);
  BaseController.sendSuccess(res, "GUEST CART MERGED", result);
});


  static removeFromCart = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
      BaseController.validateRequest(
    variationIdParamValidation,
    req.params
  );

  const { variationId } = req.params;

    const result = await CartService.removeFromCart(userId, variationId);

    BaseController.logAction("ITEM REMOVED FROM CART", result);
    BaseController.sendSuccess(res, "ITEM REMOVED FROM CART", result);
  });



static updateCartQuantity = BaseController.asyncHandler(async (req, res) => {
  const userId = req.user._id;
  BaseController.validateRequest(
  variationIdParamValidation,
    req.params
  );
  const variationId = req.params.variationId;

  const validatedData = BaseController.validateRequest(
    updateCartQuantityValidation,
    req.body
  );

  const result = await CartService.updateCartQuantity(
    userId,
    variationId,
    validatedData.quantity
  );

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
