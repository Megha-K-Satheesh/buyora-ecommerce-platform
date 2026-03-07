


const mongoose = require("mongoose");
const Order = require("../models/Order");
const { ErrorFactory } = require("../utils/errors");
const syncOrderStatus = require("../utils/syncOrderStatus");
const Wallet = require("../models/Wallet");
const Coupon = require("../models/admin/Coupon");

class OrderService {

 
  static async getAllOrders(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw ErrorFactory.validation("Invalid user ID");
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name images price")
      .lean();

    return orders.map(order => ({
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productId: item.productId?._id || null,
        name: item.productId?.name || item.name || "Product name not found",
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.productId?.images || null,
        status: item.status,
       expectedDeliveryDate: item.expectedDeliveryDate 
    ? item.expectedDeliveryDate 
    : new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) 
      }))
    }));
  }

 
  static async getSingleOrder(userId, orderId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw ErrorFactory.validation("Invalid IDs");
    }

    const order = await Order.findOne({ _id: orderId, userId })
      .populate("items.productId", "name images price")
      .lean();

    if (!order) throw ErrorFactory.notFound("Order not found");

  
    const itemActions = order.items.map(item => ({
      productId: item.productId?._id,
      canCancel: ["PLACED", "CONFIRMED"].includes(item.status),
      canReturn: item.status === "DELIVERED",
      canRefund: order.paymentMethod === "ONLINE" && order.paymentStatus === "PAID"
    }));

    return {
      orderId: order._id,
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productId: item.productId?._id || null,
        name: item.productId?.name || item.name || "Product name not found",
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.productId?.images || null,
        status: item.status,
        expectedDeliveryDate: item.expectedDeliveryDate || null
      })),
      itemActions 
    };
  }








    static async cancelOrderItem(userId, orderId, productId, cancelReason = "No reason provided") {
 
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw ErrorFactory.validation("Invalid user or order ID");
    }

  
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw ErrorFactory.notFound("Order not found");

    let itemCancelled = false;
    let refundAmount = 0;

 
    order.items.forEach(item => {
      if (item.productId.toString() === productId.toString() && ["PLACED", "CONFIRMED"].includes(item.status)) {
        item.status = "CANCELLED";
        itemCancelled = true;
        item.cancelReason = cancelReason;

        if (order.paymentMethod === "ONLINE" && order.paymentStatus === "PAID") {
          refundAmount += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }
      }
    });

    if (!itemCancelled) {
      throw ErrorFactory.validation("Item cannot be cancelled or already cancelled");
    }

  
    const activeItems = order.items.filter(i => i.status !== "CANCELLED");

    order.subtotal = activeItems.reduce(
      (sum, i) => sum + (Number(i.mrp) || 0) * (Number(i.quantity) || 0),
      0
    );

    order.totalAmount = activeItems.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0
    );

  
    if (activeItems.length === 0) {
      order.orderStatus = "CANCELLED"; 
   
    }


    if (refundAmount > 0) {
      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
      }

      wallet.balance += refundAmount;
      wallet.transactions.push({
        type: "CREDIT",
        amount: refundAmount,
        reason: `Refund for cancelled order item: ${cancelReason}`,
        orderId: order._id
      });

      await wallet.save();
    }

    await order.save();
    return order;
  }



static async requestReturn(userId, orderId, productId) {

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw ErrorFactory.notFound("Order not found");

  const item = order.items.find(
    i => i.productId.toString() === productId.toString()
  );

  if (!item) throw ErrorFactory.notFound("Item not found");

  if (item.status !== "DELIVERED") {
    throw ErrorFactory.validation("Item cannot be returned");
  }

  item.status = "RETURN_REQUESTED";
  item.returnRequestedAt = new Date();


  syncOrderStatus(order);

  await order.save();

  return order;
}



}

module.exports = OrderService


