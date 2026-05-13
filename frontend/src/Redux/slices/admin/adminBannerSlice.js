import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminBannerService } from "../../../services/adminBannerService";


export const addBanner = createAsyncThunk(
  "banner/addBanner",
  async (formData, thunkAPI) => {
    try {
      const res = await adminBannerService.addBanner(formData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Add banner failed"
      );
    }
  }
);


export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (params, thunkAPI) => {
    try {
      const res = await adminBannerService.getBanners(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Get banners failed"
      );
    }
  }
);

export const getBannersUser = createAsyncThunk(
  "banner/getBannersUser",
  async (params, thunkAPI) => {
    try {
      const res = await adminBannerService.getBannersUser(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Get banners failed"
      );
    }
  }
);


export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await adminBannerService.updateBanner(id, formData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update banner failed"
      );
    }
  }
);


export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (bannerId, { rejectWithValue }) => {
    try {
      await adminBannerService.deleteBanner(bannerId);
      return bannerId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Delete failed"
      );
    }
  }
);

export const getBannerById = createAsyncThunk(
  "banner/getBannerById",
  async (id, thunkAPI) => {
    try {
      const res = await adminBannerService.getBannerById(id);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Get banner failed"
      );
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    banner:null,
    loading: false,
    error: null,

   
    totalPages: 0,
    currentPage: 1,
    totalBanners: 0,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

  
      .addCase(addBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
      })
     
.addCase(getBannersUser.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(getBannersUser.fulfilled, (state, action) => {
  state.loading = false;


  state.banners = action.payload.data || [];
})

.addCase(getBannersUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
      .addCase(getBanners.fulfilled, (state, action) => {
  state.loading = false;

  state.banners = action.payload.data.data || [];
  state.totalPages = action.payload.data.totalPages;
  state.currentPage = action.payload.data.currentPage;
  state.totalBanners = action.payload.data.totalBanners;
})
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBanner.fulfilled, (state, action) => {
        const index = state.banners.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })

     
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(
          (b) => b._id !== action.payload
        );
      })



      .addCase(getBannerById.pending, (state) => {
  state.loading = true;
})

.addCase(getBannerById.fulfilled, (state, action) => {
  state.loading = false;
  state.banner = action.payload; 
})

.addCase(getBannerById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },



  
});

export const { setCurrentPage } = bannerSlice.actions;
export default bannerSlice.reducer;
