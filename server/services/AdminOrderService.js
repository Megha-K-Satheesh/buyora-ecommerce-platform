const mongoose  = require("mongoose");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const { ErrorFactory } = require("../utils/errors");
const syncOrderStatus = require("../utils/syncOrderStatus");
const Product = require("../models/admin/Product");
const Coupon = require("../models/admin/Coupon");




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
    currentPage: Number(page)
  };
}




static async getSingleOrder(orderId) {
  const order = await Order.findById(orderId)
    .populate("userId", "name email")
    .populate("items.productId", "name images price"); 

  if (!order) throw ErrorFactory.notFound("Order not found");

  return order;
}







static async updateOrderItemStatus(orderId, productId, status, variantId) {

  console.log("all service updated console", orderId, productId, variantId, status);

  if (!productId) throw ErrorFactory.notFound("Product ID not found");

  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  const product = await Product.findById(productId);
  if (!product) throw ErrorFactory.notFound("Product not found");

  let itemFound = false;

  for (let item of order.items) {

    if (
      item.productId.toString() === productId.toString() &&
      ((variantId && item.variantId?.toString() === variantId.toString()) ||
        (!variantId && !item.variantId))
    ) {

      item.status = status;
      itemFound = true;

      // CONFIRMED
      if (status === "CONFIRMED") {
        item.confirmAt = new Date();
      }

      // SHIPPED
      if (status === "SHIPPED") {
        item.shippedAt = new Date();
      }

      // DELIVERED
      if (status === "DELIVERED") {

        item.deliveredAt = new Date();

        if (variantId) {

          const updatedProduct = await Product.findOneAndUpdate(
            {
              _id: productId,
              "variations._id": variantId,
              "variations.stock": { $gte: item.quantity }
            },
            {
              $inc: { "variations.$.stock": -item.quantity }
            },
            { new: true }
          );

          if (!updatedProduct) {
            throw ErrorFactory.validation("Not enough stock for this variant");
          }

          updatedProduct.totalStock = updatedProduct.variations.reduce(
            (sum, v) => sum + v.stock,
            0
          );

          await updatedProduct.save();
        }
      }

  



if (status === "RETURNED") {
  item.returnedAt = new Date();

 

  const coupon = await Coupon.findById(order.couponId);

  const applicableCategories =
    coupon?.applicableCategories?.map(String) || [];

  const productIds = order.items.map(i => i.productId);

  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id category");

  const productCategoryMap = {};
  products.forEach(p => {
    productCategoryMap[p._id.toString()] = String(p.category);
  });

  const isEligible = (i) => {
    if (order.couponScope === "GLOBAL") return true;

    const cat = productCategoryMap[i.productId.toString()];
    return applicableCategories.includes(cat);
  };

  const itemTotal = Number(item.price) * Number(item.quantity);

  console.log("ITEM TOTAL:", itemTotal);

  let itemDiscount = 0;

 
  const totalDiscount =
    order.couponBreakup?.globalDiscount +
    order.couponBreakup?.categoryDiscount;

  if (isEligible(item)) {
    const eligibleItems = order.items.filter(isEligible);

    const eligibleTotal = eligibleItems.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0
    );

    const ratio = itemTotal / eligibleTotal;

    itemDiscount = ratio * totalDiscount;
  }

  const refundAmount = Math.round(itemTotal - itemDiscount);


  item.refundStatus = "REFUNDED";
  item.refundAmount = refundAmount;
  item.refundMethod = "WALLET";
  item.refundProcessedAt = new Date();

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
    orderId: order._id,
    createdAt: new Date()
  });

  await wallet.save();
}
      break;
    }
  }

  if (!itemFound) throw ErrorFactory.validation("Order item not found");

  const allDelivered = order.items.every(i => i.status === "DELIVERED");

  if (allDelivered && order.paymentMethod === "COD") {
    order.paymentStatus = "PAID";
  }

  syncOrderStatus(order);

  await order.save();

  return order;
}



 




static async approveReturn(orderId, productId, variantId) {
  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  const item = order.items.find(i => {
    return (
      i.productId?.toString() === productId?.toString() &&
      (
        (variantId && i.variantId?.toString() === variantId.toString()) ||
        (!variantId && !i.variantId)
      )
    );
  });

  if (!item || item.status !== "RETURN_REQUESTED") {
    throw ErrorFactory.validation("Return request not found");
  }

  item.status = "RETURN_APPROVED";

  syncOrderStatus(order);
  await order.save();

  return order;
}
static async rejectReturn(orderId, productId, variantId) {
  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  const item = order.items.find(i => {
    return (
      i.productId?.toString() === productId?.toString() &&
      (
        (variantId && i.variantId?.toString() === variantId.toString()) ||
        (!variantId && !i.variantId)
      )
    );
  });

  if (!item || item.status !== "RETURN_REQUESTED") {
    throw ErrorFactory.validation("Return request not found");
  }

  item.status = "RETURN_REJECTED";

  syncOrderStatus(order);
  await order.save();

  return order;
}

}
module.exports = AdminOrderService;

