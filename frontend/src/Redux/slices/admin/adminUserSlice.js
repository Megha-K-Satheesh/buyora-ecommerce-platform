import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminUserService } from "../../../services/adminUserService";

export const getUsersList = createAsyncThunk(
  "user/getUsersList",
  async (params, thunkAPI) => {
    try {
      const res = await adminUserService.getUsersList(params);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const banUser = createAsyncThunk(
  "user/banUser",
  async ({ userId, reason }, thunkAPI) => {
    try {
      const res = await adminUserService.banUser(userId, reason);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to ban user"
      );
    }
  }
);

export const unbanUser = createAsyncThunk(
  "user/unbanUser",
  async (userId, thunkAPI) => {
    try {
      const res = await adminUserService.unbanUser(userId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to unban user"
      );
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState: {
    users: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    totalUsers: 0,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(banUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(banUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unbanUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = adminUserSlice.actions;
export default adminUserSlice.reducer;
