import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminSalesReportService } from "../../../services/salesReportService";

export const getSalesReport = createAsyncThunk(
  "salesReport/getReport",
  async (filters, thunkAPI) => {
    try {
      const res = await adminSalesReportService.getSalesReport(filters);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch sales report"
      );
    }
  }
);


export const exportSalesReport = createAsyncThunk(
  "salesReport/exportReport",
  async ({ filters, fileType }, thunkAPI) => {
    try {
      const res = await adminSalesReportService.exportReport({ ...filters, fileType });
    
      const blob = new Blob([res.data], { type: res.data?.mimeType || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", res.data.fileName || "Sales_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return "success";
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to export sales report");
    }
  }
);

const initialState = {
  report: [],
  totalQuantity: 0,
  totalRevenue: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  status: "",
  paymentStatus: "",
  loading: false,
  error: null,
};

const salesReportSlice = createSlice({
  name: "salesReport",
  initialState,
  reducers: {
    resetSalesReport: (state) => {
      state.report = [];
      state.totalQuantity = 0;
      state.totalRevenue = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.limit = 10;
      state.status = "";
      state.paymentStatus = "";
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action) => {
      const { status, paymentStatus } = action.payload;
      state.status = status || "";
      state.paymentStatus = paymentStatus || "";
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.report;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalRevenue = action.payload.totalRevenue;
        state.currentPage = action.payload.currentPage;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSalesReport, setFilters, setPage } = salesReportSlice.actions;

export default salesReportSlice.reducer;
