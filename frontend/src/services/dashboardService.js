import adminApiClient from "../utils/adminApiClient";

export const adminDashboardService = {

  // 1️⃣ DASHBOARD STATS
  getDashboardStats() {
    return adminApiClient.get("/dashboard/stats");
  },

  // 2️⃣ MONTHLY ORDERS GRAPH
  getMonthlyOrders() {
    return adminApiClient.get("/dashboard/monthly-orders");
  },

  // 3️⃣ REVENUE GROWTH GRAPH
  getRevenueGrowth() {
    return adminApiClient.get("/dashboard/revenue-growth");
  },

  // 4️⃣ TOP SELLING PRODUCTS
  getTopProducts() {
    return adminApiClient.get("/dashboard/top-products");
  },

  // 5️⃣ RECENT ORDERS
  getRecentOrders() {
    return adminApiClient.get("/dashboard/recent-orders");
  },

  // 6️⃣ LOW STOCK PRODUCTS
  getLowStockProducts() {
    return adminApiClient.get("/dashboard/low-stock");
  },

  // 7️⃣ ORDER STATUS DISTRIBUTION
  getOrderStatusDistribution() {
    return adminApiClient.get("/dashboard/order-status");
  }

};
