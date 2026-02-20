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

export const getProductsList = createAsyncThunk(
  'product/getProductsList',
  async (params, thunkAPI) => {
    try {
      const res = await adminService.getProductsList(params);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Get Products failed"
      );
    }
  }
);


export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await adminService.updateProduct(id, formData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update product failed"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteProduct(productId);
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Delete failed"
      );
    }
  }
);

const productSlice = createSlice({
  name:"product",
   initialState: { products: [],
     loading: false, 
     error: null,
     totalPages: 0, 
  currentPage: 1, 
  totalProducts: 0 
    },
  reducers:{

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
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
      })
      .addCase(getProductsList.pending,(state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(getProductsList.fulfilled
        ,(state,action)=>{
        state.loading = false;
        state.error = null;
       state.products = action.payload.data;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalProducts = action.payload.totalProducts;
      })
      .addCase(getProductsList.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })




      .addCase(updateProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateProduct.fulfilled, (state, action) => {
  state.loading = false;

  const index = state.products.findIndex(
    (product) => product._id === action.payload._id
  );

  if (index !== -1) {
    state.products[index] = action.payload;
  }
})
.addCase(updateProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


.addCase(deleteProduct.pending, (state) => {
  state.loading = true;
})
.addCase(deleteProduct.fulfilled, (state, action) => {
  state.loading = false;

  state.products = state.products.filter(
    (product) => product._id !== action.payload.productId
  );
})
.addCase(deleteProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

     
  }
})
export const { setCurrentPage } = productSlice.actions
export default productSlice.reducer;
