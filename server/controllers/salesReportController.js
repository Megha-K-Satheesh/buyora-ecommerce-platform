
const SalesReportService = require("../services/SaleReportService");
const BaseController = require("./BaseController");

class SalesReportController extends BaseController {

  static getSalesReport = BaseController.asyncHandler(async (req, res) => {
    const {
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
    } = req.query;

    const report = await SalesReportService.getSalesReport({
      startDate,
      endDate,
      search,
      productId,
      categoryId,
      brandId,
      status,
      paymentStatus,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    BaseController.logAction("SALES REPORT FETCHED", { startDate, endDate, productId, categoryId });
    BaseController.sendSuccess(res, "SALES REPORT FETCHED", report);
  });

  static exportSalesReport = BaseController.asyncHandler(async (req, res) => {
    const {
      startDate,
      endDate,
      productId,
      search,
      categoryId,
      brandId,
      status,
      paymentStatus,
      fileType = "excel"
    } = req.query;

    const { buffer, fileName, mimeType } = await SalesReportService.exportReport({
      startDate,
      endDate,
      search,
      productId,
      categoryId,
      brandId,
      status,
      paymentStatus,
      fileType
    });

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", mimeType);
    res.send(buffer);
  });

}

module.exports = SalesReportController;
