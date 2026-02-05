import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../../../services/adminService";


export const  addCategory = createAsyncThunk('category/addCategory',async(data,thunkApi)=>{
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

export const categoriesTable =createAsyncThunk('category/categoriesTable',async({page=1,limit=2,
    level="",
    status="",
    search="",
},thunkApi)=>{
   try {
       const res = await adminService.categoriesTable(page,limit,level,status,search);
       return res.data.data
   } catch (err) {
       return thunkApi.rejectWithValue(err.response?.data?.error?.message || "Get category for Table Failed")
   }
})

export const updateCategory = createAsyncThunk('category/updataCategory',async({categoryId,data},thunkApi)=>{
   try {
       const res = await adminService.updateCategory(categoryId,data)
       return res.data.data
   } catch (err) {
    return thunkApi.rejectWithValue(err.response?.data?.error?.message ||"Failed to update category")
   }  
})
export const deleteCategory = createAsyncThunk('category/deleteCategory',async(categoryId,thunkApi)=>{
    try {
         const res = await adminService.deleteCategory(categoryId)
         return categoryId
    } catch (err) {
       return thunkApi.rejectWithValue(err.response?.data?.error?.message ||"Failed to Delete category")
    }
})


 export const getCategoryById = createAsyncThunk('category/getCategoryById',async(categoryId,thunkApi)=>{
     try {
         const res = await adminService.getCategoryById(categoryId);
         return res.data.data
     } catch (err) {
        return thunkApi.rejectWithValue(err.response?.data?.error?.message ||"Failed to get category by id")
     }
 })


const categorySlice = createSlice({
  name:"category",
  initialState:{
    loading:false,
    loadingCategory:false,
    error:null,
    categories:[],
    selectedCategory:null,
      categoriesTable: [],
      currentPage:1,
      totalPages:1,
      totalCategories:0
  },
  reducers:{

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
  extraReducers:(builder)=>{
     builder
     .addCase(addCategory.pending,(state)=>{
         state.loadingCategory= true;
         state.error = null;

     })
     .addCase(addCategory.fulfilled,(state)=>{
      state.loadingCategory = false;
      state.error = null;
     
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
     
    
      .addCase(categoriesTable.pending,(state)=>{
         state.loading = true;
         state.error = null;

     })
     .addCase(categoriesTable.fulfilled,(state,action)=>{
      state.loading = false;
      state.error = null;
      state.categoriesTable = action.payload.data;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalCategories = action.payload.totalCategories
     })

     .addCase(categoriesTable.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload
     
     })
     .addCase(updateCategory.pending,(state)=>{
      state.loadingCategory = true;
      state.error = null;
      
     })
     .addCase(updateCategory.fulfilled,(state,action)=>{
      state.loadingCategory = false;
      state.error = null;
       state.categories = state.categories.map((cat) =>
        cat._id === action.payload._id ? action.payload : cat
      );
       state.categoriesTable = state.categoriesTable.map((cat) =>
        cat._id === action.payload._id ? action.payload : cat
      ); 
        state.selectedCategory = action.payload;
     })
     .addCase(updateCategory.rejected,(state,action)=>{
      state.loadingCategory = false;
      state.error = action.payload;
      
     })
     .addCase(deleteCategory.pending,(state)=>{
        state.loadingCategory= true;
        state.error = null
     })
     .addCase(deleteCategory.fulfilled,(state,action)=>{
        state.loadingCategory= false;
        state.error = null;

         state.categories = state.categories.filter(
        (cat) => cat._id !== action.payload
      );
       state.categoriesTable = state.categoriesTable.filter(
        (cat) => cat._id !== action.payload
      );
     })
     .addCase(deleteCategory.rejected,(state,action)=>{
        state.loadingCategory= false;
        state.error = action.payload
        
     })
     .addCase(getCategoryById.pending,(state)=>{
        state.loadingCategory = true;
        state.error = null
     })
     .addCase(getCategoryById.fulfilled,(state,action)=>{
        state.loadingCategory = false;
        state.error = null;
        state.selectedCategory = action.payload
     })
     .addCase(getCategoryById.rejected,(state,action)=>{
        state.loadingCategory = false;
        state.error = action.payload
     })
  }
})
export const { setCurrentPage } = categorySlice.actions;
export default categorySlice.reducer
