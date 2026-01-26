import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../Redux/slices/adminAuthSlice';
import authReducer from '../Redux/slices/authSlice';


import userReducer from '../Redux/slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth:adminAuthReducer,
    user:userReducer,
  },
});
