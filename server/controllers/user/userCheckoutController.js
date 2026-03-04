

const CheckoutService = require("../../services/CheckoutService");
const BaseController = require("../BaseController");

class CheckoutController extends BaseController {

  static getOrderSummary = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
   console.log(userId)
    const result = await CheckoutService.getOrderSummary(userId);

    BaseController.logAction("ORDER SUMMARY FETCHED", result);
    BaseController.sendSuccess(res, "ORDER SUMMARY FETCHED", result);
  });


 static placeOrder = BaseController.asyncHandler(async (req, res) => {
  const result = await CheckoutService.placeOrder(req.user._id, req.body);

  // Log the order creation
  BaseController.logAction("ORDER CREATED", result.order);

  if (result.paymentRequired) {
    BaseController.sendSuccess(res, "PAYMENT INITIAaTED", {
      order: result.order,
        paymentRequired: result.paymentRequired,
      razorpayOrderId: result.razorpayOrderId,
      amount: result.amount,
      currency: result.currency
    });
  } else {
    BaseController.sendSuccess(res, "ORDER PLACED SUCCESSFULLY", { order: result.order });
  }
});

static verifyPayment = BaseController.asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const order = await CheckoutService.verifyPayment(userId, req.body);

  BaseController.logAction("PAYMENT VERIFIED", order);
  BaseController.sendSuccess(res, "PAYMENT SUCCESSFUL", { order });
});

}

module.exports = CheckoutController;
