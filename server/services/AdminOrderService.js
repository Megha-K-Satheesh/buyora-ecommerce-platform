const mongoose  = require("mongoose");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const { ErrorFactory } = require("../utils/errors");
const syncOrderStatus = require("../utils/syncOrderStatus");




class AdminOrderService {



static async getAllOrdersAdmin({ page = 1, limit = 5, status = "", search = "" }) {
  const skip = (page - 1) * limit;

 
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("items.productId", "name images price")
    .lean();


  const filteredOrders = orders
    .map(order => {
      let filteredItems = status
        ? order.items.filter(item => item.status === status)
        : order.items;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredItems = filteredItems.filter(
          item =>
            (item.productId?.name || item.name || "")
              .toLowerCase()
              .includes(searchLower) ||
            (order.orderNumber || "").toLowerCase().includes(searchLower)
        );
      }

      if (filteredItems.length === 0) return null;

      return {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: filteredItems
      };
    })
    .filter(order => order !== null);


  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / limit);
  const paginatedOrders = filteredOrders.slice(skip, skip + limit);


  return {
    orders: paginatedOrders,
    totalOrders,
    totalPages,
    currentPage: page
  };
}

  static async getSingleOrder(orderId) {
    const order = await Order.findById(orderId)
      .populate("userId", "name email");

    if (!order) throw ErrorFactory.notFound("Order not found");

    return order;
  }



static async approveReturn(orderId, productId) {

  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  const item = order.items.find(
    i => i.productId.toString() === productId
  );

  if (!item || item.status !== "RETURN_REQUESTED") {
    throw ErrorFactory.validation("Return request not found");
  }

  const refundAmount = item.price * item.quantity;

  item.status = "RETURN_APPROVED";
  item.refundStatus = "REFUNDED";
  item.refundAmount = refundAmount;
  item.refundMethod = "WALLET";

  let wallet = await Wallet.findOne({ userId: order.userId });

  if (!wallet) {
    wallet = await Wallet.create({
      userId: order.userId,
      balance: 0,
      transactions: []
    });
  }

  wallet.balance += refundAmount;

  wallet.transactions.push({
    type: "CREDIT",
    amount: refundAmount,
    reason: "RETURN_REFUND",
    orderId: order._id
  });

  await wallet.save();

  syncOrderStatus(order);

  await order.save();

  return order;
}



static async rejectReturn(orderId, productId) {

  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  const item = order.items.find(
    i => i.productId.toString() === productId
  );

  if (!item || item.status !== "RETURN_REQUESTED") {
    throw ErrorFactory.validation("Return request not found");
  }

  item.status = "RETURN_REJECTED";

  await order.save();

  return order;
}




static async updateOrderItemStatus(orderId, productId, status) {

  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  let itemFound = false;

  order.items.forEach((item) => {

    if (item.productId.toString() === productId.toString()) {
      item.status = status;
      itemFound = true;

      if (status === "CONFIRMED") item.confirmAt = new Date();
      if (status === "SHIPPED") item.shippedAt = new Date();
      if (status === "DELIVERED") item.deliveredAt = new Date();
    }

  });

  if (!itemFound) throw ErrorFactory.validation("Item not found");


  const allDelivered = order.items.every(i => i.status === "DELIVERED");

  if (allDelivered && order.paymentMethod === "COD") {
    order.paymentStatus = "PAID";
  }

  await order.save();

  return order;
}
}

module.exports = AdminOrderService;
