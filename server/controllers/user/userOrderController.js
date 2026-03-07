const OrderService = require("../../services/OrderService");
const BaseController = require("../BaseController");

class OrderController extends BaseController {


  static getAllOrders = BaseController.asyncHandler(async (req, res) => {


console.log(req.user._id)
  const orders = await OrderService.getAllOrders(
    req.user._id,
    
  );

  BaseController.sendSuccess(res, "ALL ORDERS FETCHED", orders);
});

  static getSingleOrder = BaseController.asyncHandler(async (req, res) => {

  //     console.log("User:", req.user);
  // console.log("Order ID:", req.params.id);
    const orderId = req.params.orderId;
    const order = await OrderService.getSingleOrder(req.user._id, orderId);
    BaseController.sendSuccess(res, "ORDER DETAILS FETCHED", order);
  });
 static cancelOrderItem = BaseController.asyncHandler(async (req, res) => {
    const { orderId, productId, reason } = req.body;
    const updatedOrder = await OrderService.cancelOrderItem(req.user._id, orderId, productId, reason);
    BaseController.sendSuccess(res, "ITEM CANCELLED", updatedOrder);
  });


  static requestReturnItem = BaseController.asyncHandler(async (req, res) => {
    const { orderId, productId, reason } = req.body;
    const updatedOrder = await OrderService.requestReturn(req.user._id, orderId, productId, reason);
    BaseController.sendSuccess(res, "RETURN REQUESTED", updatedOrder);
  });
 
}

module.exports = OrderController;
