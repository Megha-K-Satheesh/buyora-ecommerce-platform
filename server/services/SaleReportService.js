


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

  let categoryIds = [];

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

    categoryIds = [
      new mongoose.Types.ObjectId(categoryId),
      ...getChildrenIds(categoryId)
    ];
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
    totalsPipeline.push({
      $match: {
        "product.category": { $in: categoryIds }
      }
    });
  }

  if (brandId) {
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

  pipeline.push(
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" }
  );

  if (categoryId) {
    pipeline.push({
      $match: {
        "product.category": { $in: categoryIds }
      }
    });
  }

  if (brandId) {
    pipeline.push({
      $match: {
        "product.brand": mongoose.Types.ObjectId(brandId)
      }
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "categoryDetails"
      }
    },
    {
      $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: "brands",
        localField: "product.brand",
        foreignField: "_id",
        as: "brandDetails"
      }
    },
    {
      $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true }
    }
  );

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

  pipeline.push(
    {
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
    },
    { $sort: { orderDate: -1 } }
  );

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

  console.log({
  startDate,
  endDate,
  search,
  productId,
  categoryId,
  brandId,
  status,
  paymentStatus
});
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

  // EXCEL 
  if (fileType === "excel") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

    // Header
    const headerRow = sheet.addRow([
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

    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F46E5" }
      };
      cell.font = { color: { argb: "FFFFFF" }, bold: true };
    });

    // Data rows
    report.forEach(r => {
      const row = sheet.addRow([
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

      const statusCell = row.getCell(9);
      const paymentCell = row.getCell(10);

      // Order status color
      if (r.orderStatus === "DELIVERED") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "C6EFCE" } };
      } else if (r.orderStatus === "PENDING") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEB9C" } };
      } else {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC7CE" } };
      }

      // Payment status color
      if (r.paymentStatus === "PAID") {
        paymentCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "C6EFCE" } };
      } else {
        paymentCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEB9C" } };
      }
    });

    // Total row
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

  //  PDF
  if (fileType === "pdf") {
    const tableBody = [[
      "Order No","Date","Product","Category","Brand",
      "Qty","Price","Total","Order Status","Payment"
    ]];

  
    const getStatusStyle = (status) => {
      if (status === "DELIVERED") return { color: "#166534", fillColor: "#dcfce7" };
      if (status === "PENDING") return { color: "#92400e", fillColor: "#fef3c7" };
      if (status === "RETURN_REJECTED") return { color: "#991b1b", fillColor: "#fee2e2" };
      return {};
    };

    const getPaymentStyle = (status) => {
      if (status === "PAID") return { color: "#166534", fillColor: "#dcfce7" };
      return { color: "#92400e", fillColor: "#fef3c7" };
    };

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

        {
          text: r.orderStatus || "",
          alignment: "center",
          margin: [3, 3],
          ...getStatusStyle(r.orderStatus)
        },

        {
          text: r.paymentStatus || "",
          alignment: "center",
          margin: [3, 3],
          ...getPaymentStyle(r.paymentStatus)
        }
      ]);
    });

    tableBody.push([
      "TOTAL","","","","",
      totalQuantity.toString(),"",
      totalRevenue.toString(),"",""
    ]);

   
    tableBody[0] = tableBody[0].map(h => ({
      text: h,
      color: "white",
      bold: true,
      alignment: "center"
    }));

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 30, 20, 30],

      content: [
        {
          columns: [
            { text: "Buyora", style: "company" },
            {
              text: `Date: ${new Date().toLocaleDateString()}`,
              alignment: "right",
              style: "date"
            }
          ]
        },

        { text: "Sales Report", style: "header" },

        {
          columns: [
            { text: `Revenue\n₹${totalRevenue}`, style: "summaryBox" },
            { text: `Quantity\n${totalQuantity}`, style: "summaryBox" },
            { text: `Orders\n${report.length}`, style: "summaryBox" }
          ],
          margin: [0, 10, 0, 15]
        },

        {
          style: "tableStyle",
          table: {
            headerRows: 1,
            widths: ["auto","auto","*","*","*","auto","auto","auto","auto","auto"],
            body: tableBody
          },
          layout: {
            fillColor: (rowIndex) => {
              if (rowIndex === 0) return "#4f46e5";
              return rowIndex % 2 === 0 ? "#f9fafb" : null;
            }
          }
        },

        {
          text: `Generated on ${new Date().toLocaleString()}`,
          style: "footer"
        }
      ],

      styles: {
        company: { fontSize: 14, bold: true, color: "#4f46e5" },
        date: { fontSize: 9, color: "#666" },
        header: { fontSize: 20, bold: true, margin: [0, 10, 0, 10] },
        summaryBox: {
          fontSize: 10,
          bold: true,
          alignment: "center",
          fillColor: "#eef2ff",
          margin: [5,5,5,5]
        },
        tableStyle: { fontSize: 9 },
        footer: { fontSize: 8, alignment: "center", color: "#888" }
      },

      defaultStyle: { font: "Helvetica" }
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks = [];

      pdfDoc.on("data", chunk => chunks.push(chunk));
      pdfDoc.on("end", () => {
        resolve({
          buffer: Buffer.concat(chunks),
          fileName: "Sales_Report.pdf",
          mimeType: "application/pdf"
        });
      });

      pdfDoc.on("error", reject);
      pdfDoc.end();
    });
  }

  throw ErrorFactory.validation("Unsupported file type");
}


}

module.exports = SalesReportService;
