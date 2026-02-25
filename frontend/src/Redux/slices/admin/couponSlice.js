import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { couponService } from "../../../services/couponService";


export const addCoupon = createAsyncThunk(
  "coupon/addCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const response = await couponService.addCoupon(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
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


const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    loading: false,
    error: null,
    success: false,
    coupons: [],
    currentPage: 1,
    totalPages: 0,
    totalCoupons: 0,
  },
  reducers: {
    resetCouponState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
     setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCoupon.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(getCouponsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCouponsList.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.totalPages = action.payload.totalPages;
        state.totalCoupons = action.payload.total;
      })
      .addCase(getCouponsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCouponState,setCurrentPage } = couponSlice.actions;
export default couponSlice.reducer;
