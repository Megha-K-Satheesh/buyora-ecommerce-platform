



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminDashboardService } from "../../../services/dashboardService";

// Async thunks
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

// Initial state
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
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch stats";
      });

    
    builder
      .addCase(getMonthlyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMonthlyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyOrders = action.payload;
      })
      .addCase(getMonthlyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch monthly orders";
      });

    
    builder
      .addCase(getRevenueGrowth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRevenueGrowth.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueGrowth = action.payload;
      })
      .addCase(getRevenueGrowth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch revenue";
      });

  
    builder
      .addCase(getTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch top products";
      });

   
    builder
      .addCase(getRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(getRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recent orders";
      });

   
    builder
      .addCase(getLowStockProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLowStockProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockProducts = action.payload;
      })
      .addCase(getLowStockProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch low stock products";
      });

 
    builder
      .addCase(getOrderStatusDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderStatusDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatus = action.payload;
      })
      .addCase(getOrderStatusDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch order status";
      });
  },
});

export default dashboardSlice.reducer;
