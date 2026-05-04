const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middlewares/auth");
const SalesReportController = require("../controllers/salesReportController");

router.get("/sales-report", authenticateAdmin, SalesReportController.getSalesReport);
router.get("/sales-report/export", authenticateAdmin, SalesReportController.exportSalesReport);

module.exports = router;
