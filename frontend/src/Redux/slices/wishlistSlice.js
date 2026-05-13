

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userWishlistService } from "../../services/wishlistService";
import { addToCartBackend } from "./cartSlice";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const res = await userWishlistService.getWishlist({ page, limit });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    try {
      const res = await userWishlistService.addToWishlist({ productId });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      await userWishlistService.removeFromWishlist(productId);
      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

export const moveToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async ({ productId, variationId, size, color, quantity }, thunkAPI) => {
    try {
      await userWishlistService.moveToCart({ productId, variationId, size, color, quantity });
       await thunkAPI.dispatch(addToCartBackend({ productId, variationId, size, color, quantity }));

      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to move to cart"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    totalItems: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.page = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
    addToWishlistOptimistic: (state, action) => {
      state.items.push(action.payload);
      state.totalItems = state.items.length;
    },
    removeFromWishlistOptimistic: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalItems = state.items.length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.push(action.payload);
          state.totalItems += 1;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.totalItems = state.items.length;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(moveToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearWishlist,
  addToWishlistOptimistic,
  removeFromWishlistOptimistic
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
