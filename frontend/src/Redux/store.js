import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../Redux/slices/adminAuthSlice';
import authReducer from '../Redux/slices/authSlice';
import userReducer from '../Redux/slices/userSlice';
import brandReducer from './slices/admin/brandSlice';
import categoryReducer from './slices/admin/categorySlice';
import productReducer from './slices/admin/productSlice';

import productsReducer from './slices/general/productSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth:adminAuthReducer,
    user:userReducer,
    category:categoryReducer,
    product:productReducer,
    brand:brandReducer,
    generalProducts:productsReducer
  },
});
