import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../../services/adminService";


export const  addCategory = createAsyncThunk('admin/addCategory',async(data,thunkApi)=>{
    try {
           const res = await adminService.addCategory(data)
           return res.data.data
    } catch (err) {
     return thunkApi.rejectWithValue(err.response?.data?.error?.message|| "Add category Failed")
    }
})

export const getCategory = createAsyncThunk('admin/getCategory',async(_,thunkApi)=>{
  try {
      const res = await adminService.getCategory();
        return res.data.data
  } catch (err) {
     return  thunkApi.rejectWithValue(err.response?.data?.error?.message|| "Get category Failed")
  }
})

const adminSlice = createSlice({
  name:"category",
  initialState:{
    loading:false,
    loadingCategory:false,
    error:null,
    categories:[]
  },
  reducers:{},
  extraReducers:(builder)=>{
     builder
     .addCase(addCategory.pending,(state)=>{
         state.loadingCategory= true;
         state.error = null;

     })
     .addCase(addCategory.fulfilled,(state,action)=>{
      state.loadingCategory = false;
      state.error = null;
     state.categories = [ action.payload];
     })
     .addCase(addCategory.rejected,(state,action)=>{
      state.loadingCategory = false;
      state.error = action.payload
     
     })
     .addCase(getCategory.pending,(state)=>{
         state.loading = true;
         state.error = null;

     })
     .addCase(getCategory.fulfilled,(state,action)=>{
      state.loading = false;
      state.error = null;
      state.categories = action.payload
     })
     .addCase(getCategory.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload
     
     })
  }
})
export default adminSlice.reducer
