import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { clearAuthToken, setAuthToken } from '../../utils/authToken';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, thunkAPI) => {
    try {
      const res = await authService.register({
  name: `${data.firstName} ${data.lastName}`, 
  email: data.email,
  password: data.password,
});
      return res.data.data;
    } catch (err) {
       const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Registration failed. Please try again';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data, thunkAPI) => {
    try {
      const res = await authService.verifyOtp(data);
      setAuthToken(res.data.token);
      return res.data.data;
    } catch (err) {
        //     const message =
        // err.response?.data?.message ||
        // err.response?.data?.error?.message ||
        // 'Invalid or expired OTP';

      return thunkAPI.rejectWithValue(err.response?.data?.error?.message || 'invalid or expired OTP');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ userId, purpose }, thunkAPI) => {
    try {
      const res = await authService.resendOtp({ userId, purpose });
      return res.data.message; // backend can return success message
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Failed to resend OTP';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk('auth/forgotPassword',async(data,thunkAPI)=>{
      try {
          
         const res = await authService.forgotPassword({email:data.email})
            return res.data
      } catch (err) {
         const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Invalid or expired OTP';
        return thunkAPI.rejectWithValue(message)
      }
})
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken,newPassword }, thunkAPI) => {
    try {
      const res = await authService.resetPassword({
        
        resetToken,
        newPassword
      });

    localStorage.removeItem('resetToken');

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Password reset failed';

      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const verifyPasswordResetOtp = createAsyncThunk(
  'auth/verifyPasswordResetOtp',
  async (data, thunkAPI) => {
    try {
      const res = await authService.verifyPasswordResetOtp(data);
      localStorage.setItem('resetToken', res.data.data.resetToken);
      
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'OTP verification failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk('auth/login',async (data,thunkAPI)=>{
           
           try {
              const res = await authService.login(data)
              return res.data;
            
           } catch (err) {

                const message =
                      err.response?.data?.message ||
                      err.response?.data?.error?.message ||
                      'Login failed';
             return thunkAPI.rejectWithValue(message)
           }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
    loading: false,
    loginLoading:false,
    error: null,
   successMessage: null,
    isOtpSent: false,
    user: null,
    role:null,
    isAuthenticated: !!localStorage.getItem("authToken"),
    userId:  localStorage.getItem('otpUserId') || null,
    resetToken: localStorage.getItem('resetToken') || null,
  },
  reducers: {
    clearAuthError:(state)=>{
      state.error=null;
    },
    logout:(state)=>{
        state.user = null;
    state.role = null;
     state.isAuthenticated = false;
    state.error = null;
    clearAuthToken();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state,action) => {
        state.loading = false;
        state.isOtpSent = true;
         state.userId = action.payload.userId || null; 
       if (state.userId) localStorage.setItem('otpUserId', state.userId);
          
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => {
         state.loading = true;
          state.error = null;
        })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userId = null;
        localStorage.removeItem('otpUserId')
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null; 
                          
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Something went wrong';
      })
      .addCase(forgotPassword.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
       .addCase(forgotPassword.fulfilled,(state,action)=>{
         state.loading = false;
         state.successMessage = action.payload;
       })
       .addCase(forgotPassword.rejected,(state,action)=>{
          state.loading =false;
          state.error = action.payload
       })
       .addCase(verifyPasswordResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPasswordResetOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyPasswordResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(resetPassword.fulfilled, (state, action) => {
  state.loading = false;
  state.successMessage = action.payload.message;

  state.resetToken = null;
  localStorage.removeItem('resetToken');
})
.addCase(resetPassword.rejected, (state, action) => {
  state.loading= false;
  state.error = action.payload;
})


.addCase(login.pending,(state)=>{
  state.loginLoading = true;
  state.error = null
})
.addCase(login.fulfilled,(state,action)=>{
    state.loginLoading = false;
    state.error = null;
    state.user = action.payload.data.user;
    state.isAuthenticated = true;
    state.role = action.payload.data.user.role
    setAuthToken(action.payload.data.token)
})
.addCase(login.rejected,(state,action)=>{
   state.loginLoading = false;
   state.error = action.payload;
})

  },
});

export default authSlice.reducer;

export const { clearAuthError } = authSlice.actions;
