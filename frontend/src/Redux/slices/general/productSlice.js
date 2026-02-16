import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { userProductsService } from "../../../services/productsService";
  export const getProducts = createAsyncThunk(
  "generalProducts/getProducts",
  async (data, thunkAPI) => {
    try {
      const response = await userProductsService.getProducts(data)
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const getSidebarFilters = createAsyncThunk(
  "generalProducts/getSidebarFilters",
  async ({ level1, level2 }, thunkAPI) => {
    try {
      const response = await userProductsService.getSidebarFilters( level1, level2 )
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch sidebar filters");
    }
  }
);

 export const getProductById = createAsyncThunk('generalProducts/get-product',async(id,thunkApi)=>{
    try {
         const res = await userProductsService.getProductById(id)
          return res.data.data
    } catch (err) {
       return thunkApi.rejectWithValue(err.message || "Get Single product failed")
    }
 })

const productSlice = createSlice({
  name: "generalProducts",
  initialState: {
    products: [],
    filters: {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      discountRanges: [],
      priceRange: { min: 0, max: 0 },
    },
    loading: false,
    totalPages: 0,
    error: null,
    product:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.totalPages = action.payload.pages;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sidebar Filters
      .addCase(getSidebarFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSidebarFilters.fulfilled, (state, action) => {
  state.filters.categories = action.payload.categories || [];
  state.filters.brands = action.payload.brands || [];
  state.filters.colors = action.payload.colors || [];
  state.filters.sizes = action.payload.sizes || [];
  state.filters.discountRanges = action.payload.discountRanges || [];
  state.filters.priceRange = action.payload.priceRange || { min: 0, max: 0 };
  state.loading = false;
  state.error = null
})
      .addCase(getSidebarFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProductById.pending,(state)=>{
         state.loading = true;
         state.error = null;
      })
      .addCase(getProductById.fulfilled,(state,action)=>{
         state.loading = false;
         state.error = null;
         state.product = action.payload
      })
      .addCase(getProductById.rejected,(state,action)=>{
         state.loading = false;
         state.error = action.payload;
      })
  },
});

export default productSlice.reducer;
