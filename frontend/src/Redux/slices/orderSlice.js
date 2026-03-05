
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";


export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (_, thunkAPI) => {
    try {
      const res = await orderService.getAllOrders();
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const getSingleOrder = createAsyncThunk(
  "orders/getSingleOrder",
  async (orderId, thunkAPI) => {
    try {
      const res = await orderService.getSingleOrder(orderId);
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);


export const cancelOrderItem = createAsyncThunk(
  "orders/cancelOrderItem",
  async ({ orderId, productId }, thunkAPI) => {
    try {
      const res = await orderService.cancelOrderItem(orderId, productId);
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to cancel item"
      );
    }
  }
);


export const requestReturnItem = createAsyncThunk(
  "orders/requestReturnItem",
  async ({ orderId, productId }, thunkAPI) => {
    try {
      const res = await orderService.requestReturnItem(orderId, productId);
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to request return"
      );
    }
  }
);



const initialState = {
  allOrders: [],
  singleOrder: null,
  loading: false,
  error: null,
};


const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.allOrders = [];
      state.singleOrder = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
   
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(getSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOrder = action.payload;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(cancelOrderItem.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(cancelOrderItem.fulfilled, (state, action) => { 
        state.loading = false; 
        state.singleOrder = action.payload;
      })
      .addCase(cancelOrderItem.rejected, (state, action) => { state.loading = false; state.error = action.payload; })




       .addCase(requestReturnItem.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(requestReturnItem.fulfilled, (state, action) => { 
        state.loading = false; 
        state.singleOrder = action.payload; 
      })
      .addCase(requestReturnItem.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
