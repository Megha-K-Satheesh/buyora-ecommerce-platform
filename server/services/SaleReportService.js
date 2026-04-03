


const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const PdfPrinter = require("pdfmake");
const Order = require("../models/Order");
const Category = require("../models/admin/Category");
const { ErrorFactory } = require("../utils/errors");

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

class SalesReportService {

  static async getSalesReport({
    startDate,
    endDate,
    search,
    productId,
    categoryId,
    brandId,
    status,
    paymentStatus,
    page = 1,
    limit = 10
  }) {
    const match = {};

    if (status) match.orderStatus = status;
    if (paymentStatus) match.paymentStatus = paymentStatus;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      match.createdAt = { $gte: start, $lt: end };
    }

    const totalsPipeline = [
      { $match: match },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ];

    if (categoryId) {
      const allCategories = await Category.find().lean();

      const getChildrenIds = (id) => {
        const children = allCategories.filter(
          c => String(c.parentId) === String(id)
        );
        return children.reduce(
          (acc, child) => [...acc, child._id, ...getChildrenIds(child._id)],
          []
        );
      };

      const ids = [
        new mongoose.Types.ObjectId(categoryId),
        ...getChildrenIds(categoryId)
      ];

      totalsPipeline.push({
        $match: {
          "product.category": { $in: ids }
        }
      });
    }

    if (brandId) {
      totalsPipeline.push({
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      });
      totalsPipeline.push({ $unwind: "$product" });
      totalsPipeline.push({
        $match: {
          "product.brand": mongoose.Types.ObjectId(brandId)
        }
      });
    }

    totalsPipeline.push(
      {
        $match: {
          "items.status": { $in: ["DELIVERED", "RETURN_REJECTED"] }
        }
      },
      {
        $group: {
          _id: "$_id",
          orderTotal: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] }
          },
          orderQuantity: { $sum: "$items.quantity" }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orderTotal" },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: "$orderQuantity" }
        }
      }
    );

    const totals = await Order.aggregate(totalsPipeline);
    const totalRevenue = totals[0]?.totalRevenue || 0;
    const totalQuantity = totals[0]?.totalQuantity || 0;

    const pipeline = [{ $match: match }, { $unwind: "$items" }];

    if (productId) {
      pipeline.push({
        $match: {
          "items.productId": mongoose.Types.ObjectId(productId)
        }
      });
    }

    pipeline.push({
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
      }
    });
    pipeline.push({ $unwind: "$product" });

    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "categoryDetails"
      }
    });
    pipeline.push({
      $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true }
    });

    pipeline.push({
      $lookup: {
        from: "brands",
        localField: "product.brand",
        foreignField: "_id",
        as: "brandDetails"
      }
    });
    pipeline.push({
      $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true }
    });

    if (search) {
      const regex = new RegExp(search, "i");
      pipeline.push({
        $match: {
          $or: [
            { orderNumber: regex },
            { "product.name": regex }
          ]
        }
      });
    }

    if (categoryId) {
      const allCategories = await Category.find().lean();

      const getChildrenIds = (id) => {
        const children = allCategories.filter(
          c => String(c.parentId) === String(id)
        );
        return children.reduce(
          (acc, child) => [...acc, child._id, ...getChildrenIds(child._id)],
          []
        );
      };

      const ids = [
        new mongoose.Types.ObjectId(categoryId),
        ...getChildrenIds(categoryId)
      ];

      pipeline.push({
        $match: {
          "categoryDetails._id": { $in: ids }
        }
      });
    }

    if (brandId) {
      pipeline.push({
        $match: {
          "brandDetails._id": mongoose.Types.ObjectId(brandId)
        }
      });
    }

    pipeline.push({
      $project: {
        orderId: "$orderNumber",
        orderDate: "$createdAt",
        productName: "$product.name",
        category: "$categoryDetails.name",
        brand: "$brandDetails.name",
        quantity: "$items.quantity",
        price: "$items.price",
        totalRevenue: {
          $multiply: ["$items.quantity", "$items.price"]
        },
        orderStatus: "$items.status",
        paymentStatus: "$paymentStatus"
      }
    });

    pipeline.push({ $sort: { orderDate: -1 } });

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Order.aggregate(countPipeline);
    const totalRecords = countResult[0]?.total || 0;
    const totalPages = limit > 0 ? Math.ceil(totalRecords / limit) : 1;

    if (limit > 0) {
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const report = await Order.aggregate(pipeline);

    return {
      report,
      totalQuantity,
      totalRevenue,
      currentPage: page,
      totalPages,
      limit
    };
  }

  static async exportReport({
    startDate,
    endDate,
    search,
    productId,
    categoryId,
    brandId,
    status,
    paymentStatus,
    fileType = "excel"
  }) {
    const { report, totalQuantity, totalRevenue } =
      await SalesReportService.getSalesReport({
        startDate,
        endDate,
        search,
        productId,
        categoryId,
        brandId,
        status,
        paymentStatus,
        page: 1,
        limit: 0
      });

    if (fileType === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Sales Report");

      sheet.addRow([
        "Order No",
        "Date",
        "Product",
        "Category",
        "Brand",
        "Qty",
        "Price",
        "Total",
        "Order Status",
        "Payment Status"
      ]);

      report.forEach(r => {
        sheet.addRow([
          r.orderId,
          new Date(r.orderDate).toLocaleDateString(),
          r.productName,
          r.category || "",
          r.brand || "",
          r.quantity,
          r.price,
          r.totalRevenue,
          r.orderStatus || "",
          r.paymentStatus || ""
        ]);
      });

      sheet.addRow([]);
      sheet.addRow([
        "TOTAL",
        "",
        "",
        "",
        "",
        totalQuantity,
        "",
        totalRevenue
      ]);

      const buffer = await workbook.xlsx.writeBuffer();

      return {
        buffer,
        fileName: "Sales_Report.xlsx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      };
    }

   
    if (fileType === "pdf") {
  const tableBody = [
    [
      "Order No",
      "Date",
      "Product",
      "Category",
      "Brand",
      "Qty",
      "Price",
      "Total",
      "Order Status",
      "Payment"
    ]
  ];

  report.forEach(r => {
    tableBody.push([
      r.orderId,
      new Date(r.orderDate).toLocaleDateString(),
      r.productName,
      r.category || "",
      r.brand || "",
      r.quantity.toString(),
      r.price.toString(),
      r.totalRevenue.toString(),
      r.orderStatus || "",
      r.paymentStatus || ""
    ]);
  });

  tableBody.push([
    "TOTAL",
    "",
    "",
    "",
    "",
    totalQuantity.toString(),
    "",
    totalRevenue.toString(),
    "",
    ""
  ]);

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [15, 20, 15, 20],
    content: [
      { text: "Sales Report", style: "header" },
      {
        style: "tableStyle",
        table: { headerRows: 1, widths: ["auto","auto","*","*","*","auto","auto","auto","auto","auto"], body: tableBody },
        layout: { fillColor: (rowIndex) => rowIndex === 0 ? "#eeeeee" : null }
      }
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      tableStyle: { fontSize: 10 }
    },
    defaultStyle: { font: "Helvetica" }
  };

  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve({
        buffer,
        fileName: "Sales_Report.pdf",
        mimeType: "application/pdf"
      });
    });

    pdfDoc.on("error", (err) => reject(err));
    pdfDoc.end();
  });
}

    throw ErrorFactory.validation("Unsupported file type");
  }
}

module.exports = SalesReportService;
