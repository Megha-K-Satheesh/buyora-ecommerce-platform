import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



import { FaBoxOpen, FaUsers } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { getDashboardStats, getLowStockProducts, getMonthlyOrders, getOrderStatusDistribution, getRecentOrders, getRevenueGrowth, getTopProducts } from "../../../Redux/slices/admin/dashboardSlice";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import LowStockProductsTable from "../../../components/Admin/LowStockProductsTable";
import OrdersBarChart from "../../../components/Admin/OrderBarChart";
import OrderStatusPieChart from "../../../components/Admin/OrderStatusPieChart";
import RecentOrdersTable from "../../../components/Admin/ResentOrdersTable";
import RevenueLineChart from "../../../components/Admin/RevenueLineCart";
import StatsCard from "../../../components/Admin/StatsCard.jsx";
import TopProductsTable from "../../../components/Admin/TopProductsTable";
const DashboardPage = () => {
  const dispatch = useDispatch();

  const {
    stats,
    monthlyOrders,
    revenueGrowth,
    topProducts,
    recentOrders,
    lowStockProducts,
    orderStatus,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getMonthlyOrders());
    dispatch(getRevenueGrowth());
    dispatch(getTopProducts());
    dispatch(getRecentOrders());
    dispatch(getLowStockProducts());
    dispatch(getOrderStatusDistribution());
  }, [dispatch]);

  return (

    <>

          <AdminOutletHead heading={"DASHBOARD"} />
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


        <StatsCard title="Total Users" value={stats?.totalUsers} icon={<FaUsers />} />

<StatsCard title="Total Orders" value={stats?.totalOrders} icon={<FaBoxOpen />} />

<StatsCard title="Total Products" value={stats?.totalProducts} icon={<MdInventory />} />

<StatsCard title="Total Revenue" value={`₹${stats?.totalRevenue}`} icon={<RiMoneyRupeeCircleFill />} />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <OrdersBarChart data={monthlyOrders} />

        <RevenueLineChart data={revenueGrowth} />

      </div>

      {/* Order Status */}
      <OrderStatusPieChart data={orderStatus} />

      {/* Tables */}

      <TopProductsTable products={topProducts} />

      <RecentOrdersTable orders={recentOrders} />

      <LowStockProductsTable products={lowStockProducts} />

    </div>
    </>
  );
};

export default DashboardPage;





