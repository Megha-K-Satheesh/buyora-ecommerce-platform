const Product = require("../models/admin/Product");
const Order = require("../models/Order");
const User = require("../models/User");


class DashboardService {

 


  


static async getDashboardStats() {

  const totalUsers = await User.countDocuments({ role: "user" });

  const totalProducts = await Product.countDocuments();

  const totalOrders = await Order.countDocuments({
    orderStatus: { $ne: "CANCELLED" }
  });

  const revenue = await Order.aggregate([
    { $unwind: "$items" },

    {
      $match: {
        "items.status": { $in: ["DELIVERED", "RETURN_REJECTED"] }
      }
    },

    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"]
          }
        },
        totalQuantity: {
          $sum: "$items.quantity"
        }
      }
    }
  ]);

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue: revenue[0]?.totalRevenue || 0,
    totalQuantity: revenue[0]?.totalQuantity || 0 
  };
}


  static async getMonthlyOrders() {

  const orders = await Order.aggregate([
    {
      $match: {
        orderStatus: { $in: ["PLACED","DELIVERED","SHIPPED","CONFIRMED"] }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  const months = [
    "", "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return orders.map(item => ({
    month: months[item._id],
    orders: item.orders
  }));
}







static async getRevenueGrowth() {

  const revenue = await Order.aggregate([

    { $unwind: "$items" },

    {
      $match: {
        "items.status": {
          $in: ["DELIVERED", "RETURN_REJECTED"]
        }
      }
    },

    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"]
          }
        }
      }
    },

    {
      $sort: { "_id": 1 }
    }
  ]);

  const months = [
    "", "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return revenue.map(item => ({
    month: months[item._id],
    revenue: item.revenue
  }));
}


  static async getTopProducts() {

    const products = await Order.aggregate([
      {
        $match: {
          orderStatus: "DELIVERED"
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.productId",
          sold: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"]
            }
          }
        }
      },
      {
        $sort: { sold: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          productName: "$product.name",
          sold: 1,
          revenue: 1,
          image: { $arrayElemAt: ["$product.images", 0] }
        }
      }
    ]);

    return products;
  }





  static async getRecentOrders() {

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean();

    return orders.map(order => ({
      orderId: order._id,
      orderNumber: order.orderNumber,
      customer: order.userId?.name || "Unknown",
      email: order.userId?.email || "",
      amount: order.totalAmount,
      status: order.orderStatus,
    
      paymentStatus: order.paymentStatus,
      date: order.createdAt
    }));
  }




  static async getLowStockProducts() {

    const products = await Product.find({
      totalStock: { $lt: 200 },
      status: "active"
    })
      .sort({ totalStock: 1 })
      .limit(5)
      .select("name totalStock images")
      .lean();

    return products.map(product => ({
      productId: product._id,
      name: product.name,
      stockLeft: product.totalStock,
      image: product.images?.[0] || null
    }));
  }




  
static async getOrderStatusDistribution() {

  const statusData = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return statusData.map(item => ({
    status: item._id,
    count: item.count
  }));
}

}

module.exports = DashboardService;
