import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminDashboardService } from "../../../services/dashboardService";



// 1️⃣ Dashboard Stats
export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getDashboardStats();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);


// 2️⃣ Monthly Orders
export const getMonthlyOrders = createAsyncThunk(
  "dashboard/getMonthlyOrders",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getMonthlyOrders();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch monthly orders"
      );
    }
  }
);


// 3️⃣ Revenue Growth
export const getRevenueGrowth = createAsyncThunk(
  "dashboard/getRevenueGrowth",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getRevenueGrowth();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue"
      );
    }
  }
);


// 4️⃣ Top Products
export const getTopProducts = createAsyncThunk(
  "dashboard/getTopProducts",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getTopProducts();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch top products"
      );
    }
  }
);


// 5️⃣ Recent Orders
export const getRecentOrders = createAsyncThunk(
  "dashboard/getRecentOrders",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getRecentOrders();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch recent orders"
      );
    }
  }
);


// 6️⃣ Low Stock Products
export const getLowStockProducts = createAsyncThunk(
  "dashboard/getLowStockProducts",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getLowStockProducts();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch low stock products"
      );
    }
  }
);


// 7️⃣ Order Status Distribution
export const getOrderStatusDistribution = createAsyncThunk(
  "dashboard/getOrderStatusDistribution",
  async (_, thunkAPI) => {
    try {
      const res = await adminDashboardService.getOrderStatusDistribution();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch order status"
      );
    }
  }
);


const initialState = {
  stats: null,
  monthlyOrders: [],
  revenueGrowth: [],
  topProducts: [],
  recentOrders: [],
  lowStockProducts: [],
  orderStatus: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder

      // Stats
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Monthly Orders
      .addCase(getMonthlyOrders.fulfilled, (state, action) => {
        state.monthlyOrders = action.payload;
      })

      // Revenue
      .addCase(getRevenueGrowth.fulfilled, (state, action) => {
        state.revenueGrowth = action.payload;
      })

      // Top Products
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      })

      // Recent Orders
      .addCase(getRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })

      // Low Stock
      .addCase(getLowStockProducts.fulfilled, (state, action) => {
        state.lowStockProducts = action.payload;
      })

      // Order Status
      .addCase(getOrderStatusDistribution.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      });

  },
});

export default dashboardSlice.reducer;
