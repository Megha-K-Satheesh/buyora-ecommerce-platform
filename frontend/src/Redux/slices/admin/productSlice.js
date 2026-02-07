import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../../../services/adminService";


export const addProduct = createAsyncThunk('product/addProducts',async(formData,thunkAPI)=>{
      try {
            const res = await adminService.addProduct(formData)
            return res.data.data
      } catch (err) {
          return thunkAPI.rejectWithValue(err.response?.data?.message || "Add product failed")
      }
})

const productSlice = createSlice({
  name:"product",
   initialState: { products: [], loading: false, error: null },
  reducers:{},
  extraReducers:(builder)=>{
      builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
})

export default productSlice.reducer;
