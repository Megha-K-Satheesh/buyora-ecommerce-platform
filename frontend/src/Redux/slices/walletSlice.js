
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletService } from "../../services/walletService";



export const getWallet = createAsyncThunk(
  "wallet/getWallet",
  async ({ page = 1, limit = 5 } = {}, thunkAPI) => {
    try {
      const res = await walletService.getWallet(page, limit);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch wallet"
      );
    }
  }
);

const initialState = {
  balance: 0,
  transactions: [],
  totalTransactions: 0,
  page: 1,               
  limit: 5,             
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletState: (state) => {
      state.balance = 0;
      state.transactions = [];
      state.totalTransactions = 0;
      state.page = 1;
      state.limit = 10;
      state.loading = false;
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
        state.totalTransactions = action.payload.totalTransactions;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWalletState, setPage } = walletSlice.actions;
export default walletSlice.reducer;
