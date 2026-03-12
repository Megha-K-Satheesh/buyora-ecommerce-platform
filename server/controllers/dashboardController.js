const DashboardService = require("../services/DashboardService");
const BaseController = require("./BaseController");


class DashboardController extends BaseController {


  
  static getDashboardStats = BaseController.asyncHandler(async (req, res) => {

    const stats = await DashboardService.getDashboardStats();

    BaseController.sendSuccess(res, "DASHBOARD STATS FETCHED", stats);
  });





  static getMonthlyOrders = BaseController.asyncHandler(async (req, res) => {

    const orders = await DashboardService.getMonthlyOrders();

    BaseController.sendSuccess(res, "MONTHLY ORDERS FETCHED", orders);
  });


  
  static getRevenueGrowth = BaseController.asyncHandler(async (req, res) => {

    const revenue = await DashboardService.getRevenueGrowth();

    BaseController.sendSuccess(res, "REVENUE GROWTH FETCHED", revenue);
  });



  static getTopProducts = BaseController.asyncHandler(async (req, res) => {

    const products = await DashboardService.getTopProducts();

    BaseController.sendSuccess(res, "TOP PRODUCTS FETCHED", products);
  });


  


  static getRecentOrders = BaseController.asyncHandler(async (req, res) => {

    const orders = await DashboardService.getRecentOrders();

    BaseController.sendSuccess(res, "RECENT ORDERS FETCHED", orders);
  });





  static getLowStockProducts = BaseController.asyncHandler(async (req, res) => {

    const products = await DashboardService.getLowStockProducts();

    BaseController.sendSuccess(res, "LOW STOCK PRODUCTS FETCHED", products);
  });



  static getOrderStatusDistribution = BaseController.asyncHandler(async (req, res) => {

    const status = await DashboardService.getOrderStatusDistribution();

    BaseController.sendSuccess(res, "ORDER STATUS DISTRIBUTION FETCHED", status);
  });

}

module.exports = DashboardController;
