

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { couponService } from "../../../services/couponService";




export const addCoupon = createAsyncThunk(
  "coupon/addCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const response = await couponService.addCoupon(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


export const getCouponsList = createAsyncThunk(
  "coupon/getCouponsList",
  async ({ page = 1, limit = 10, search = "", status = "", category = "" }, { rejectWithValue }) => {
    try {
      const response = await couponService.getCouponsList({ page, limit, search, status, category });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
    }
  }
);

export const getCouponById = createAsyncThunk(
  "coupon/getCouponById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await couponService.getCouponById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch coupon");
    }
  }
);


export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ couponId, data }, { rejectWithValue }) => {
    try {
      const response = await couponService.updateCoupon(couponId, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update coupon");
    }
  }
);


export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      await couponService.deleteCoupon(couponId);
      return couponId; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
    }
  }
);


const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    loading: false,
    error: null,
    success: false,
    coupons: [],
    currentCoupon: null, 
    currentPage: 1,
    totalPages: 0,
    totalCoupons: 0,
  },
  reducers: {
    resetCouponState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentCoupon = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(addCoupon.pending, (state) => { state.loading = true; })
      .addCase(addCoupon.fulfilled, (state, action) => { state.loading = false; state.success = true; })
      .addCase(addCoupon.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

     
      .addCase(getCouponsList.pending, (state) => { state.loading = true; })
      .addCase(getCouponsList.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.totalPages = action.payload.totalPages;
        state.totalCoupons = action.payload.total;
          state.currentPage = action.payload.page;
      })
      .addCase(getCouponsList.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      
      .addCase(getCouponById.pending, (state) => { state.loading = true; })
      .addCase(getCouponById.fulfilled, (state, action) => { state.loading = false; state.currentCoupon = action.payload; })
      .addCase(getCouponById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

  
      .addCase(updateCoupon.pending, (state) => { state.loading = true; })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const index = state.coupons.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.coupons[index] = action.payload;
      })
      .addCase(updateCoupon.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteCoupon.pending, (state) => { state.loading = true; })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { resetCouponState, setCurrentPage } = couponSlice.actions;
export default couponSlice.reducer;
