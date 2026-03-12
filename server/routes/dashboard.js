const express = require("express");
const router = express.Router();


const DashboardController = require("../controllers/dashboardController");
const { authenticateAdmin } = require("../middlewares/auth");



router.get("/stats", authenticateAdmin, DashboardController.getDashboardStats);


router.get("/monthly-orders", authenticateAdmin, DashboardController.getMonthlyOrders);


router.get("/revenue-growth", authenticateAdmin, DashboardController.getRevenueGrowth);


router.get("/top-products", authenticateAdmin, DashboardController.getTopProducts);


router.get("/recent-orders", authenticateAdmin, DashboardController.getRecentOrders);


router.get("/low-stock", authenticateAdmin, DashboardController.getLowStockProducts);


router.get("/order-status", authenticateAdmin, DashboardController.getOrderStatusDistribution);


module.exports = router;
