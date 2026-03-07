// redux/slices/couponSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { couponService } from "../../services/couponService";

export const getAllCoupons = createAsyncThunk(
  "coupons/getAllCoupons",
  async ({ page = 1, limit = 5 } = {}, thunkAPI) => {
    try {
      const res = await couponService.getAllCoupons({ page, limit });
      return res.data.data.coupons; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

const initialState = {
  coupons: [],
  totalCount: 0,
  page: 1,
  limit: 5,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;
