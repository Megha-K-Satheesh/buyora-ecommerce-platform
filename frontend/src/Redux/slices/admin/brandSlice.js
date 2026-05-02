import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../../../services/adminService";
import { brandService } from "../../../services/brandService";

 export const addBrand = createAsyncThunk('brand/addBrand',async(data,thunkAPI)=>{
    try {
        const res = await adminService.addBrand(data)
          return res.data
    } catch (err) {
       return thunkAPI.rejectWithValue(err?.message?.data?.error|| "Brand Add Failed")
    }
 })

 export const getAllBrands = createAsyncThunk(
  "brand/getAllBrands",
  async (params, thunkAPI) => {
    try {
      const res = await brandService.getAllBrands(params);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch brands"
      );
    }
  }
);


export const getBrandById = createAsyncThunk(
  "brand/getBrandById",
  async (id, thunkAPI) => {
    try {
      const res = await brandService.getBrandById(id);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch brand"
      );
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ brandId, data }, thunkAPI) => {
    try {
      const res = await brandService.updateBrand(brandId, data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Update failed"
      );
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id, thunkAPI) => {
    try {
      const res = await brandService.deleteBrand(id);
      return { id };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Delete failed"
      );
    }
  }
);
 export const getBrandsByCategoryId= createAsyncThunk('brand/getBrands',async(categoryId,thunkAPI)=>{
    try {
        const res = await brandService.getBrandsByCategoryId(categoryId)
        return res.data.data
      
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message?.data?.error|| "Brand get Failed")
    }
 })


const brandSlice = createSlice({
  name: "brand",

initialState: {
  brands: [],
  selectedBrand: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalBrands: 0,
},
  reducers: {setCurrentPage: (state, action) => {
    state.currentPage = action.payload;
  },},
  extraReducers: (builder) => {
    builder
   
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
      })
       .addCase(getAllBrands.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllBrands.fulfilled, (state, action) => {
  state.loading = false;
  state.brands = action.payload.brands;
  state.totalBrands = action.payload.total;
  state.currentPage = action.payload.page;
  state.totalPages = action.payload.totalPages;
})
    .addCase(getAllBrands.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getBrandById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getBrandById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedBrand = action.payload;
    })
    .addCase(getBrandById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateBrand.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateBrand.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.brands.findIndex(
        (b) => b._id === action.payload._id
      );
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    })
    .addCase(updateBrand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(deleteBrand.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteBrand.fulfilled, (state, action) => {
      state.loading = false;
      state.brands = state.brands.filter(
        (b) => b._id !== action.payload.id
      );
    })
    .addCase(deleteBrand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export const {
setCurrentPage
  
} =brandSlice.actions;
export default brandSlice.reducer;


