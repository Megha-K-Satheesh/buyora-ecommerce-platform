


const mongoose = require("mongoose");
const Order = require("../models/Order");
const { ErrorFactory } = require("../utils/errors");
const syncOrderStatus = require("../utils/syncOrderStatus");
const Wallet = require("../models/Wallet");
const Coupon = require("../models/admin/Coupon");
const Product = require("../models/admin/Product");
const Category = require("../models/admin/Category");
const path = require("path");
const PdfPrinter = require("pdfmake");
const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
const printer = new PdfPrinter(fonts);
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








static async generateInvoice(userId, orderId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    throw ErrorFactory.validation("Invalid IDs");
  }

  const order = await Order.findOne({ _id: orderId, userId })
    .populate("items.productId", "name price images")
    .lean();

  if (!order) {
    throw ErrorFactory.notFound("Order not found");
  }

  const invoiceItems = order.items.filter((item) =>
    ["DELIVERED", "RETURN_REJECTED"].includes(item.status)
  );

  if (invoiceItems.length === 0) {
    throw ErrorFactory.validation(
      "Invoice can only be generated after delivery"
    );
  }




  const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const paymentStatus = (order.paymentStatus || "PENDING").toUpperCase();

  const statusColors = {
    PAID: "#16A34A",
    PENDING: "#EA580C",
    FAILED: "#DC2626",
  };

  let subtotal = 0;

  const productRows = invoiceItems.map((item, index) => {
    const productName = item.productId?.name || "Product";
    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    const total = quantity * price;

    subtotal += total;

    return [
      {
        text: productName,
        style: "productName",
        margin: [0, 6, 0, 6],
      },
      {
        text: quantity.toString(),
        alignment: "center",
        style: "tableCell",
      },
      {
        text: formatCurrency(price),
        alignment: "right",
        style: "tableCell",
      },
      {
        text: formatCurrency(total),
        alignment: "right",
        style: "tableCellBold",
      },
    ];
  });

  const shippingCharge = Number(order.shippingCharge || 0);
  const discount = Number(order.discountAmount || 0);

  const grandTotal = subtotal + shippingCharge - discount;
const shipping = order.shippingAddress || {};
const customerAddress = [
  shipping.fullName,
  shipping.houseName,
  shipping.street,
  shipping.landmark,
  shipping.city,
  shipping.state,
  shipping.pincode,
  shipping.phone,
]
  .filter(Boolean)
  .join(", ");

  const docDefinition = {
    pageSize: "A4",

    pageMargins: [40, 45, 40, 55],

    footer: function (currentPage, pageCount) {
      return {
        margin: [40, 10, 40, 20],
        stack: [
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 1,
                lineColor: "#E5E7EB",
              },
            ],
          },

          {
            margin: [0, 12, 0, 0],
            columns: [
              {
                stack: [
                  {
                    text: "Thank you for shopping with BUYORA",
                    style: "footerTitle",
                  },
                 
                  
                ],
              },

              {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: "right",
                style: "footerText",
                margin: [0, 10, 0, 0],
              },
            ],
          },
        ],
      };
    },

    content: [
      {
        stack: [
          {
            text: "BUYORA",
            style: "brandLogo",
            alignment: "center",
          },

          {
            text: "PREMIUM E-COMMERCE",
            style: "brandTagline",
            alignment: "center",
            margin: [0, 2, 0, 0],
          },
        ],
      },

      {
        margin: [0, 28, 0, 25],
        columns: [
          {
            width: "*",
            stack: [
              {
                text: "INVOICE",
                style: "invoiceTitle",
              },

              {
                text: "Official Tax Invoice",
                style: "invoiceSubtitle",
                margin: [0, 6, 0, 0],
              },
            ],
          },

          {
            width: "auto",
            stack: [
              {
                text: paymentStatus,
                color: "#FFFFFF",
                fillColor: statusColors[paymentStatus] || "#EA580C",
                bold: true,
                fontSize: 10,
                alignment: "center",
                margin: [14, 8, 14, 8],
              },
            ],
          },
        ],
      },

      {
        margin: [0, 0, 0, 25],
        table: {
          widths: ["*", "*"],

          body: [
            [
              {
                stack: [
                  {
                    text: "Invoice Details",
                    style: "sectionTitle",
                    margin: [0, 0, 0, 14],
                  },

                  {
                    columns: [
                      {
                        width: 120,
                        text: "Invoice Number",
                        style: "label",
                      },
                      {
                        text: `INV-${order.orderNumber}`,
                        style: "value",
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },

                  {
                    columns: [
                      {
                        width: 120,
                        text: "Order Number",
                        style: "label",
                      },
                      {
                        text: order.orderNumber,
                        style: "value",
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },

                  {
                    columns: [
                      {
                        width: 120,
                        text: "Order Date",
                        style: "label",
                      },
                      {
                        text: formatDate(order.createdAt),
                        style: "value",
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },

                  {
                    columns: [
                      {
                        width: 120,
                        text: "Payment Method",
                        style: "label",
                      },
                      {
                        text: order.paymentMethod || "Online Payment",
                        style: "value",
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },

                  {
                    columns: [
                      {
                        width: 120,
                        text: "Payment Status",
                        style: "label",
                      },
                      {
                        text: paymentStatus,
                        style: "value",
                      },
                    ],
                  },
                ],
                fillColor: "#FFFFFF",
                margin: [18, 18, 18, 18],
              },

              {
                stack: [
                  {
                    text: "Shipping Address",
                    style: "sectionTitle",
                    margin: [0, 0, 0, 14],
                  },

                  {
                    text: customerAddress,
                    style: "addressText",
                    lineHeight: 1.6,
                  },
                ],
                fillColor: "#FFFFFF",
                margin: [18, 18, 18, 18],
              },
            ],
          ],
        },

        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          fillColor: () => "#F8FAFC",
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
      },

      {
        text: "Order Items",
        style: "sectionHeading",
        margin: [0, 0, 0, 14],
      },

      {
        table: {
          headerRows: 1,
          dontBreakRows: true,

          widths: ["*", 55, 110, 110],

          body: [
            [
              {
                text: "Product",
                style: "tableHeader",
              },
              {
                text: "Qty",
                style: "tableHeaderCenter",
              },
              {
                text: "Unit Price",
                style: "tableHeaderRight",
              },
              {
                text: "Total",
                style: "tableHeaderRight",
              },
            ],

            ...productRows,
          ],
        },

        layout: {
          fillColor: function (rowIndex) {
            if (rowIndex === 0) {
              return "#0F172A";
            }

            return rowIndex % 2 === 0 ? "#F8FAFC" : "#FFFFFF";
          },

          hLineColor: () => "#E5E7EB",
          vLineColor: () => "#E5E7EB",

          hLineWidth: () => 1,
          vLineWidth: () => 1,

          paddingLeft: () => 14,
          paddingRight: () => 14,
          paddingTop: () => 10,
          paddingBottom: () => 10,
        },
      },

      {
        margin: [0, 28, 0, 0],
        columns: [
          {
            width: "*",
            text: "",
          },

          {
            width: 240,

            table: {
              widths: ["*", "auto"],

              body: [
                [
                  {
                    text: "Subtotal",
                    style: "summaryLabel",
                  },
                  {
                    text: formatCurrency(subtotal),
                    style: "summaryValue",
                  },
                ],

                [
                  {
                    text: "Discount",
                    style: "summaryLabel",
                  },
                  {
                    text: `- ${formatCurrency(discount)}`,
                    style: "summaryDiscount",
                  },
                ],

                [
                  {
                    text: "Shipping",
                    style: "summaryLabel",
                  },
                  {
                    text: formatCurrency(shippingCharge),
                    style: "summaryValue",
                  },
                ],

                [
                  {
                    text: "Grand Total",
                    style: "grandTotalLabel",
                  },
                  {
                    text: formatCurrency(grandTotal),
                    style: "grandTotalValue",
                  },
                ],
              ],
            },

            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 3 ? "#EEF2FF" : "#FFFFFF";
              },

              hLineColor: () => "#E5E7EB",
              vLineColor: () => "#FFFFFF",

              paddingLeft: () => 16,
              paddingRight: () => 16,
              paddingTop: () => 12,
              paddingBottom: () => 12,
            },
          },
        ],
      },
    ],

    styles: {
      brandLogo: {
        fontSize: 30,
        bold: true,
        color: "#0F172A",
        characterSpacing: 2,
      },

      brandTagline: {
        fontSize: 9,
        color: "#64748B",
        characterSpacing: 1.5,
      },

      invoiceTitle: {
        fontSize: 28,
        bold: true,
        color: "#0F172A",
      },

      invoiceSubtitle: {
        fontSize: 11,
        color: "#64748B",
      },

      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: "#111827",
      },

      sectionHeading: {
        fontSize: 16,
        bold: true,
        color: "#0F172A",
      },

      label: {
        fontSize: 10,
        color: "#6B7280",
      },

      value: {
        fontSize: 10,
        bold: true,
        color: "#111827",
      },

      addressText: {
        fontSize: 10.5,
        color: "#1F2937",
      },

      tableHeader: {
        color: "#FFFFFF",
        bold: true,
        fontSize: 11,
      },

      tableHeaderCenter: {
        color: "#FFFFFF",
        bold: true,
        fontSize: 11,
        alignment: "center",
      },

      tableHeaderRight: {
        color: "#FFFFFF",
        bold: true,
        fontSize: 11,
        alignment: "right",
      },

      tableCell: {
        fontSize: 10.5,
        color: "#1F2937",
      },

      tableCellBold: {
        fontSize: 10.5,
        bold: true,
        color: "#111827",
      },

      productName: {
        fontSize: 11,
        bold: true,
        color: "#0F172A",
      },

      summaryLabel: {
        fontSize: 11,
        color: "#4B5563",
      },

      summaryValue: {
        fontSize: 11,
        bold: true,
        color: "#111827",
        alignment: "right",
      },

      summaryDiscount: {
        fontSize: 11,
        bold: true,
        color: "#16A34A",
        alignment: "right",
      },

      grandTotalLabel: {
        fontSize: 13,
        bold: true,
        color: "#0F172A",
      },

      grandTotalValue: {
        fontSize: 14,
        bold: true,
        color: "#2563EB",
        alignment: "right",
      },

      footerTitle: {
        fontSize: 10,
        bold: true,
        color: "#111827",
      },

      footerText: {
        fontSize: 9,
        color: "#6B7280",
        margin: [0, 3, 0, 0],
      },
    },

    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const chunks = [];

  return new Promise((resolve, reject) => {
    pdfDoc.on("data", (chunk) => chunks.push(chunk));

    pdfDoc.on("end", () => {
      resolve({
        buffer: Buffer.concat(chunks),
        fileName: `BUYORA_Invoice_${order.orderNumber}.pdf`,
        mimeType: "application/pdf",
      });
    });

    pdfDoc.on("error", reject);

    pdfDoc.end();
  });
}



}

module.exports = OrderService


