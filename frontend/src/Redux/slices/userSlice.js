import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";


export const getUserProfile = createAsyncThunk('user/me',async(_,thunkAPI)=>{
    try {
         const res = await userService.getUserProfile()
         return res.data.data.user
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Profile Fetch failed")
    }
})

export const addAddress = createAsyncThunk('user/add-addAddress',async(data,thunkAPI)=>{
    try {
        const res = await userService.addAddress(data)
        return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error?.message|| "Add addAddress Failed")
    }
})
export const getAddresses = createAsyncThunk('user/get-addresses',async(data,thunkAPI)=>{
  try {
      const res =await userService.getAddresses(data)
      return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error?.message||"Get addresses failed") 
  }
})

export const getAddressById = createAsyncThunk('user/getAddressById',async (addressId,thunkAPI)=>{
     try {
         const res = await userService.getAddressById(addressId);
         return res.data
     } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error?.message || "Failed to fetch address")
     }
})

export const updateAddress = createAsyncThunk('user/updateAddress',async({
   addressId,data
},thunkAPI)=>{
   try {
      const res = await userService.updateAddress(addressId,data)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error?.message || "Failed to update address")
   }
})

export const deleteAddress = createAsyncThunk('user/deleteAddress',async(addressId,thunkAPI)=>{
     try {
       const res = await userService.deleteAddress(addressId)
       return addressId;
     } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error?.message|| "Delete Failed")
     }
})

const userSlice = 
createSlice({
   name:'user', 
   initialState:{
     loading:false,
      error:null,
       user:null,
      addresses:[],
      address:null,
    },
    reducers:{}, 
    extraReducers:(builder)=>{
       builder.addCase(getUserProfile.pending ,(state)=>{
          state.loading = true;
          state.error = null;
       }) 
      .addCase(getUserProfile.fulfilled,(state,action)=>{
          state.loading= false;
          state.error= null;
          state.user = action.payload;
      })
      .addCase(getUserProfile.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending,(state)=>{
         state.loading = true;
         state.error = null;
      })
      
      .addCase(addAddress.fulfilled,(state,action)=>{
         state.loading = false;
         state.error = null
         state.addresses.push(action.payload.data)
      })
      .addCase(addAddress.rejected,(state,action)=>{
         state.loading = false;
         state.error = action.payload
      })
    .addCase(getAddresses.pending,(state)=>{
       state.loading = true;
       state.error = null
    })
    .addCase(getAddresses.fulfilled,(state,action)=>{
       state.loading = false;
       state.error = null
       state.addresses= action.payload.data
    })
    .addCase(getAddresses.rejected,(state,action)=>{
       state.loading = false;
       state.error = action.payload
    })
    .addCase(getAddressById.pending,(state)=>{
      state.loading = true;
      state.error = null;
      
    })
    .addCase(getAddressById.fulfilled,(state,action)=>{
      state.loading = false;
      state.error = null;
      state.address = action.payload.data
      
    })
    .addCase(getAddressById.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
      
    })
    .addCase(updateAddress.pending,(state)=>{
      state.loading = true;
      state.error = null
    })
    .addCase(updateAddress.fulfilled,(state,action)=>{
      state.loading = false;
      state.error = null;
      state.addresses= state.addresses.map(addr=>(
          addr._id === action.payload.data?action.payload.data:addr
      )
      )
    })
    .addCase(updateAddress.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload
    })

    .addCase(deleteAddress.pending,(state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(deleteAddress.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = null
        state.addresses = state.addresses.filter(addr=>addr._id !== action.payload)
    })
    .addCase(deleteAddress.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload
    })
} })
export default userSlice.reducer
