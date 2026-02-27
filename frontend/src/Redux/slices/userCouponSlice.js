

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { couponService } from "../../services/couponService";

export const verifyCoupon = createAsyncThunk(
  "coupon/verifyCoupon",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await couponService.verifyCoupon(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Coupon verification failed"
      );
    }
  }
);


const initialState = {
  coupon: null,
  discountAmount: 0,
  finalAmount: 0,
  loading: false,
  error: null,
  isApplied: false
};


const userCouponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {

 
    clearCoupon: (state) => {
      state.coupon = null;
      state.discountAmount = 0;
      state.finalAmount = 0;
      state.error = null;
      state.isApplied = false;
    }

  },

  extraReducers: (builder) => {
    builder

   
      .addCase(verifyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

    
      .addCase(verifyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload.coupon;
        state.discountAmount = action.payload.discountAmount;
        state.finalAmount = action.payload.finalAmount;
        state.isApplied = true;
      })

      .addCase(verifyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.coupon = null;
        state.discountAmount = 0;
        state.finalAmount = 0;
        state.isApplied = false;
      });
  }
});

export const { clearCoupon } = userCouponSlice.actions;

export default userCouponSlice.reducer;
