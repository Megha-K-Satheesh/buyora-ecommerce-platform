


const mongoose = require("mongoose");
const Order = require("../models/Order");
const { ErrorFactory } = require("../utils/errors");
const syncOrderStatus = require("../utils/syncOrderStatus");
const Wallet = require("../models/Wallet");
const Coupon = require("../models/admin/Coupon");
const Product = require("../models/admin/Product");
const Category = require("../models/admin/Category");

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

  canCancel:
    ["PLACED", "CONFIRMED"].includes(item.status),

  canReturn:
    item.status === "DELIVERED" &&
    order.paymentStatus === "PAID",

  canRefund:
    order.paymentMethod === "ONLINE" &&
    order.paymentStatus === "PAID" &&
    ["DELIVERED", "CANCELLED"].includes(item.status)
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
        expectedDeliveryDate:
  item.expectedDeliveryDate ||
  new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
      })),
      itemActions 
    };
  }












static async cancelOrderItem(
  userId,
  orderId,
  productId,
  cancelReason = "No reason provided"
) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    throw ErrorFactory.validation("Invalid user or order ID");
  }

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw ErrorFactory.notFound("Order not found");

  const productIds = order.items.map((item) => item.productId);

  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id category");

  const productCategoryMap = {};
  products.forEach((p) => {
    productCategoryMap[p._id.toString()] = p.category.toString();
  });

  const categoryIds = Object.values(productCategoryMap);

  const categories = await Category.find({
    _id: { $in: categoryIds },
  }).select("_id parentId");

  const level2Ids = categories.map((c) => c.parentId).filter(Boolean);

  const level2Categories = await Category.find({
    _id: { $in: level2Ids },
  }).select("_id parentId");

  const level1Ids = level2Categories.map((c) => c.parentId).filter(Boolean);

  const level1Categories = await Category.find({
    _id: { $in: level1Ids },
  }).select("_id");

  const categoryMap = {};

  categories.forEach((c) => {
    categoryMap[c._id.toString()] = {
      level3: c._id.toString(),
      level2: c.parentId?.toString(),
      level1: null,
    };
  });

  level2Categories.forEach((c) => {
    const l2Id = c._id.toString();
    const l1Id = c.parentId?.toString();

    Object.values(categoryMap).forEach((cat) => {
      if (cat.level2 === l2Id) {
        cat.level1 = l1Id;
      }
    });
  });

  const couponType = order.couponType || "NONE";
  const couponValue = order.couponValue || 0;
  const couponScope = order.couponScope || "GLOBAL";
  const eligibleCategories = order.eligibleCategories || [];

  const totalDiscount =
    couponScope === "GLOBAL"
      ? order.couponBreakup?.globalDiscount || 0
      : order.couponBreakup?.categoryDiscount || 0;

  const isEligible = (item) => {
    if (couponScope === "GLOBAL") return true;

    const l3 = productCategoryMap[item.productId.toString()];
    const hierarchy = categoryMap[l3];

    const levels = [
      hierarchy?.level1,
      hierarchy?.level2,
      hierarchy?.level3,
    ];

    return eligibleCategories.some((c) =>
      levels.some((lvl) => lvl && lvl.toString() === c.toString())
    );
  };

  const originalEligibleTotal = order.items
    .filter(isEligible)
    .reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0
    );

  let refundAmount = 0;
  let itemCancelled = false;

  



  for (const item of order.items) {
  if (
    item.productId.toString() === productId.toString() &&
    ["PLACED", "CONFIRMED"].includes(item.status)
  ) {
    item.status = "CANCELLED";
    item.cancelReason = cancelReason;
    itemCancelled = true;

    const product = await Product.findById(item.productId);
    if (product) {
      const variation = product.variations.find(v =>
        v._id.toString() === (item.variationId?.toString() || "")
      );

      if (variation) {
        variation.stock += item.quantity;
      }

      product.totalStock = product.variations.reduce(
        (sum, v) => sum + v.stock,
        0
      );

      await product.save();
    }

    if (
     
      order.paymentStatus === "PAID"
    ) {
      const itemTotal = Number(item.price) * Number(item.quantity);

      if (couponType === "PERCENTAGE") {
        const itemDiscount = isEligible(item)
          ? Math.round((itemTotal / originalEligibleTotal) * totalDiscount)
          : 0;

        refundAmount += itemTotal - itemDiscount;
      } else if (couponType === "FLAT") {
        const itemDiscount = isEligible(item)
          ? Math.round((itemTotal / originalEligibleTotal) * totalDiscount)
          : 0;

        refundAmount += itemTotal - itemDiscount;
      } else {
        refundAmount += itemTotal;
      }
    }
  }
}
  if (!itemCancelled) {
    throw ErrorFactory.validation(
      "Item cannot be cancelled or already cancelled"
    );
  }

  const activeItems = order.items.filter(
    (i) => i.status !== "CANCELLED"
  );

  const newSubtotal = activeItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0
  );

  const newEligibleTotal = activeItems
    .filter(isEligible)
    .reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0
    );

  let newDiscount = 0;

  if (activeItems.length > 0) {
    if (couponType === "PERCENTAGE") {
      newDiscount = Math.round(
        (newEligibleTotal * couponValue) / 100
      );
    } else if (couponType === "FLAT") {
      newDiscount =
        originalEligibleTotal > 0
          ? Math.round(
              (newEligibleTotal / originalEligibleTotal) *
                totalDiscount
            )
          : 0;
    }
  }

  order.subtotal = newSubtotal;
  order.discountAmount = newDiscount;
  order.totalAmount = newSubtotal - newDiscount;

  order.orderStatus =
    activeItems.length === 0
      ? "CANCELLED"
      : "PARTIALLY_CANCELLED";

  if (refundAmount > 0) {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += refundAmount;

    wallet.transactions.push({
      type: "CREDIT",
      amount: refundAmount,
      reason: `Refund for cancelled item (${cancelReason})`,
      orderId: order._id,
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


