


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminOrderService } from "../../../services/adminOrderService";




export const getAllAdminOrders = createAsyncThunk(
  "adminOrders/getAllAdminOrders",
  async (params, thunkAPI) => {
    try {
      const res = await adminOrderService.getAllOrders(params);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin orders"
      );
    }
  }
);


export const getAdminSingleOrder = createAsyncThunk(
  "adminOrders/getAdminSingleOrder",
  async (orderId, thunkAPI) => {
    try {
      const res = await adminOrderService.getSingleOrder(orderId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);



export const approveReturn = createAsyncThunk(
  "adminOrders/approveReturn",
  async ({ orderId, productId }, thunkAPI) => {
    try {
      const res = await adminOrderService.approveReturn(orderId, productId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to approve return"
      );
    }
  }
);


export const rejectReturn = createAsyncThunk(
  "adminOrders/rejectReturn",
  async ({ orderId, productId }, thunkAPI) => {
    try {
      const res = await adminOrderService.rejectReturn(orderId, productId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to reject return"
      );
    }
  }
);



export const updateOrderItemStatus = createAsyncThunk(
  "adminOrders/updateOrderItemStatus",
  async ({ orderId, productId, status }, thunkAPI) => {
    try {
      console.log(orderId)
      const res = await adminOrderService.updateStatus(orderId, productId, status);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);



const initialState = {
  allOrders: [],
  singleOrder: null,
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalOrders: 0
};



const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,

  reducers: {

    clearAdminOrderState: (state) => {
      state.allOrders = [];
      state.singleOrder = null;
      state.loading = false;
      state.error = null;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }

  },

  extraReducers: (builder) => {
    builder

   
      .addCase(getAllAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllAdminOrders.fulfilled, (state, action) => {
        state.loading = false;

        state.allOrders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(getAllAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


    
      .addCase(getAdminSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAdminSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOrder = action.payload;
      })

      .addCase(getAdminSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


 
.addCase(approveReturn.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(approveReturn.fulfilled, (state, action) => {
  state.loading = false;

  const updatedOrder = {
    ...action.payload,
    orderId: action.payload.orderId || action.payload._id
  };

  state.singleOrder = updatedOrder;

  state.allOrders = state.allOrders.map((order) =>
    (order.orderId || order._id) === updatedOrder.orderId
      ? updatedOrder
      : order
  );
})

.addCase(approveReturn.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})





.addCase(rejectReturn.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(rejectReturn.fulfilled, (state, action) => {
  state.loading = false;

  const updatedOrder = {
    ...action.payload,
    orderId: action.payload.orderId || action.payload._id
  };

  state.singleOrder = updatedOrder;

  state.allOrders = state.allOrders.map((order) =>
    (order.orderId || order._id) === updatedOrder.orderId
      ? updatedOrder
      : order
  );
})

.addCase(rejectReturn.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})




.addCase(updateOrderItemStatus.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(updateOrderItemStatus.fulfilled, (state, action) => {
  state.loading = false;

  const updatedOrder = {
    ...action.payload,
    orderId: action.payload.orderId || action.payload._id
  };

  state.singleOrder = updatedOrder;

  state.allOrders = state.allOrders.map((order) =>
    (order.orderId || order._id) === updatedOrder.orderId
      ? updatedOrder
      : order
  );
})

.addCase(updateOrderItemStatus.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },
});


export const {
  clearAdminOrderState,
  setCurrentPage
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
