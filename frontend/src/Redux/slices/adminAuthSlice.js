import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminAuthService from "../../services/adminAuthService";
import { setAdminToken } from "../../utils/authToken";


  export const adminLogin = createAsyncThunk('adminAuth/login',async (data,thunkAPI)=>{
         try {
               const res = await adminAuthService.login(data)
               return res.data.data
         } catch (err) 
            {
             return thunkAPI.rejectWithValue(err.response?.dat?.error?.message || "Admin login failed")
         }
  })


const adminAuthSlice = createSlice({
   name:'adminAuth',
   initialState:{
     admin :null,
     isAuthenticated:false,
     error:null,
     loading:false
   },
   reducers:{},
   extraReducers:(builder)=>{
     builder.
     addCase(adminLogin.pending ,(state)=>{
       state.loading = true
       state.error = null
       
     })
     .addCase(adminLogin.fulfilled,(state,action)=>{
        state.loading =  false;
        state.error = null;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        setAdminToken(action.payload.token)
     })
     .addCase(adminLogin.rejected,(state,action)=>{
       state.loading = false;
       state.error = action.payload
     })
   }
})
export default  adminAuthSlice.reducer

