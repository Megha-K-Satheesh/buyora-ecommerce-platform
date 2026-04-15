

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkoutService } from "../../services/checkoutService";



export const getOrderSummary = createAsyncThunk(
  "checkout/getOrderSummary",
  async (_, thunkAPI) => {
    try {
      const res = await checkoutService.getOrderSummary();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch order summary"
      );
    }
  }
);


export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (payload, thunkAPI) => {
    try {
      const res = await checkoutService.placeOrder(payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
          err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Order failed"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "checkout/verifyPayment",
  async (payload, thunkAPI) => {
    try {
      const res = await checkoutService.verifyPayment(payload);
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Payment verification failed"
      );
    }
  }
);




const initialState = {
  items: [],

  mrpSubtotal: 0,
  subtotal: 0,

  productDiscount: 0,
  couponDiscount: 0,
  totalDiscount: 0,

  appliedCoupon: null,
  finalAmount: 0,

  lastOrder: null,
  paymentRequired: false,
  razorpayOrderId: null,

  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
   clearCheckoutState: (state) => {
  state.items = [];

  state.mrpSubtotal = 0;
  state.subtotal = 0;

  state.productDiscount = 0;
  state.couponDiscount = 0;
  state.totalDiscount = 0;

  state.finalAmount = 0;
  state.appliedCoupon = null;

  state.error = null;

  state.lastOrder = null;
  state.paymentRequired = false;
  state.razorpayOrderId = null;
},
  },

  extraReducers: (builder) => {
    builder


      .addCase(getOrderSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

.addCase(getOrderSummary.fulfilled, (state, action) => {
  state.loading = false;

  const data = action.payload || {};

  state.items = data.items || [];

  state.mrpSubtotal = data.mrpSubtotal || 0;
  state.subtotal = data.subtotal || 0;

  state.productDiscount = data.productDiscount || 0;
  state.couponDiscount = data.couponDiscount || 0;

  state.totalDiscount =
    (data.productDiscount || 0) + (data.couponDiscount || 0);

  state.finalAmount = data.finalAmount || 0;
  state.appliedCoupon = data.appliedCoupon || null;
})
      .addCase(getOrderSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(placeOrder.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(placeOrder.fulfilled, (state, action) => {
  state.loading = false;

   state.lastOrder = action.payload?.order || null;
  state.paymentRequired = action.payload?.paymentRequired || false;
  state.razorpayOrderId = action.payload?.razorpayOrderId || null;
})


.addCase(placeOrder.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(verifyPayment.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(verifyPayment.fulfilled, (state, action) => {
  state.loading = false;


  state.lastOrder = action.payload?.order || state.lastOrder;
  state.paymentRequired = false;
  state.razorpayOrderId = null;
})

.addCase(verifyPayment.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


  },
});

export const { clearCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
