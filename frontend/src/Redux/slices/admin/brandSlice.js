import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../../../services/adminService";

 export const addBrand = createAsyncThunk('brand/addBrand',async(data,thunkAPI)=>{
    try {
        const res = await adminService.addBrand(data)
          return res.data
    } catch (err) {
       return thunkAPI.rejectWithValue(err?.message?.data?.error|| "Brand Add Failed")
    }
 })
 export const getBrandsByCategoryId= createAsyncThunk('brand/getBrands',async(categoryId,thunkAPI)=>{
    try {
        const res = await adminService.getBrands(categoryId)
        return res.data.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message?.data?.error|| "Brand get Failed")
    }
 })


const brandSlice = createSlice({
  name: "brand",
 initialState : {
  brands: [],
  loading: false,
  error: null,
},
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Brand
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Brands by Category
      .addCase(getBrandsByCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrandsByCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(getBrandsByCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default brandSlice.reducer;


