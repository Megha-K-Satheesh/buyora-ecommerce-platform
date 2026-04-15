




import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reviewService } from "../../services/reviewService";

export const addReview = createAsyncThunk(
  "review/addReview",
  async ({ productId, formData }, thunkAPI) => {
    try {
      const res = await reviewService.addReview(productId, formData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||err.response?.data?.error?.message|| "Add review failed"
      );
    }
  }
);

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, thunkAPI) => {
    try {
      const res = await reviewService.getReviews(productId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch reviews failed"
      );
    }
  }
);

export const toggleLike = createAsyncThunk(
  "review/toggleLike",
  async (reviewId, thunkAPI) => {
    try {
      const res = await reviewService.toggleLike(reviewId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Like failed"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, thunkAPI) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    stats: {
      totalReviews: 0,
      avgRating: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.stats = action.payload.stats;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.review);
        state.stats = action.payload.stats;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        const { reviewId, likes } = action.payload;
        const review = state.reviews.find((r) => r._id === reviewId);
        if (review) {
          review.likes = likes;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
