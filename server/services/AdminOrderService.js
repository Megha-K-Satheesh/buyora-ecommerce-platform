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

  const query = {};

  if (status) {
    query["items.status"] = status;
  }

  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "items.name": { $regex: search, $options: "i" } }
    ];
  }

  const totalOrders = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name email")
    .populate("items.productId", "name images price")
    .lean();

  return {
    orders,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
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
  if (!productId) throw ErrorFactory.notFound("Product ID not found");

  const order = await Order.findById(orderId);
  if (!order) throw ErrorFactory.notFound("Order not found");

  const product = await Product.findById(productId);
  if (!product) throw ErrorFactory.notFound("Product not found");

  let itemFound = false;

  for (let item of order.items) {
    const match =
      item.productId.toString() === productId.toString() &&
      (
        (variantId && item.variantId?.toString() === variantId.toString()) ||
        (!variantId && !item.variantId)
      );

    if (!match) continue;

    item.status = status;
    itemFound = true;

    if (status === "CONFIRMED") {
      item.confirmAt = new Date();
    }

    if (status === "SHIPPED") {
      item.shippedAt = new Date();
    }

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

      const productDoc = await Product.findById(item.productId);
      if (!productDoc) {
        throw ErrorFactory.notFound("Product not found for stock update");
      }

      const qty = item.quantity || 1;

      if (item.variantId) {
        const variant = productDoc.variations.id(item.variantId);

        if (!variant) {
          throw ErrorFactory.notFound("Variant not found");
        }

        variant.stock = (variant.stock || 0) + qty;
      } else {
        productDoc.stock = (productDoc.stock || 0) + qty;
      }

      productDoc.totalStock = productDoc.variations.reduce(
        (sum, v) => sum + v.stock,
        0
      );

      await productDoc.save();

      // -------- REFUND LOGIC --------

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

      let totalDiscount =
        (order.couponBreakup?.globalDiscount || 0) +
        (order.couponBreakup?.categoryDiscount || 0);

      let itemDiscount = 0;

      if (isEligible(item)) {
        const eligibleItems = order.items.filter(isEligible);

        const eligibleTotal = eligibleItems.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        if (eligibleTotal > 0) {
          const ratio = itemTotal / eligibleTotal;
          itemDiscount = ratio * totalDiscount;
        }
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

  if (!itemFound) {
    throw ErrorFactory.validation("Order item not found");
  }

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

