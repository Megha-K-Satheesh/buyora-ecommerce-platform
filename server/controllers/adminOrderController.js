
const AdminOrderService = require("../services/AdminOrderService");
const BaseController = require("./BaseController");

class AdminOrderController extends BaseController {


  static getAllOrders = BaseController.asyncHandler(async (req, res) => {
   
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
console.log("form adminordercontrolelr",status)
    const orders = await AdminOrderService.getAllOrdersAdmin({
      page,
      limit,
      search,
      status
    });

    BaseController.sendSuccess(res, "ALL ORDERS FETCHED", orders);
  });

 
  static getSingleOrder = BaseController.asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    const order = await AdminOrderService.getSingleOrder(orderId);

    BaseController.sendSuccess(res, "ORDER DETAILS FETCHED", order);
  });


  static approveReturn = BaseController.asyncHandler(async (req, res) => {

    const { orderId, productId } = req.body;

    const updatedOrder = await AdminOrderService.approveReturn(orderId, productId);

    BaseController.sendSuccess(res, "RETURN APPROVED", updatedOrder);
  });


  static rejectReturn = BaseController.asyncHandler(async (req, res) => {

    const { orderId, productId } = req.body;

    const updatedOrder = await AdminOrderService.rejectReturn(orderId, productId);

    BaseController.sendSuccess(res, "RETURN REJECTED", updatedOrder);
  });


  static updateOrderItemStatus = BaseController.asyncHandler(async (req, res) => {

    const { orderId, productId, status } = req.body;  
    console.log(req.body)
    console.log("orderId orderid",orderId)
    const updatedOrder = await AdminOrderService.updateOrderItemStatus(
      orderId,
      productId,
      status
    );

    BaseController.sendSuccess(res, "ORDER STATUS UPDATED", updatedOrder);
  });

}

module.exports = AdminOrderController;
