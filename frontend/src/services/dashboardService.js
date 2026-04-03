import adminApiClient from "../utils/adminApiClient";

export const adminDashboardService = {


  getDashboardStats() {
    return adminApiClient.get("/dashboard/stats");
  },

 
  getMonthlyOrders() {
    return adminApiClient.get("/dashboard/monthly-orders");
  },

 
  getRevenueGrowth() {
    return adminApiClient.get("/dashboard/revenue-growth");
  },


  getTopProducts() {
    return adminApiClient.get("/dashboard/top-products");
  },

 
  getRecentOrders() {
    return adminApiClient.get("/dashboard/recent-orders");
  },

  
  getLowStockProducts() {
    return adminApiClient.get("/dashboard/low-stock");
  },

  
  getOrderStatusDistribution() {
    return adminApiClient.get("/dashboard/order-status");
  }

};
