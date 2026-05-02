import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../Redux/slices/adminAuthSlice';
import authReducer from '../Redux/slices/authSlice';
import cartReducer from '../Redux/slices/cartSlice';
import userChatBotReducer from "../Redux/slices/chatBotSlice";
import checkoutReducer from '../Redux/slices/checkoutSlice';
import userCouponReducer from '../Redux/slices/couponSlice';
import orderReducer from '../Redux/slices/orderSlice';
import userReviewReducer from "../Redux/slices/reviewSlice";
import userChatReducer from '../Redux/slices/userChatSlice';
import userReducer from '../Redux/slices/userSlice';
import userWalletReducer from '../Redux/slices/walletSlice';
import userWishlistReducer from "../Redux/slices/wishlistSlice";
import adminSalesReducer from "././slices/admin/salesSlice";
import adminBannerReducer from './slices/admin/adminBannerSlice';
import adminChatReducer from './slices/admin/adminChatSlice';
import adminOrderReducer from './slices/admin/adminOrderSlice';
import adminUserReducer from "./slices/admin/adminUserSlice";
import brandReducer from './slices/admin/brandSlice';
import categoryReducer from './slices/admin/categorySlice';
import couponReducer from './slices/admin/couponSlice';
import adminDashboardReducer from "./slices/admin/dashboardSlice";
import adminProductReducer from './slices/admin/productSlice';
import productsReducer from './slices/general/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth:adminAuthReducer,
    user:userReducer,
    category:categoryReducer,
    product:adminProductReducer,
    brand:brandReducer,
    generalProducts:productsReducer,
       cart: cartReducer,
       coupon:couponReducer,
        userCoupon:userCouponReducer,
      checkout:checkoutReducer,
      order:orderReducer,
      adminOrder:adminOrderReducer,
      wallet :userWalletReducer,
      wishlist:userWishlistReducer,
      dashboard :adminDashboardReducer,
      banner:adminBannerReducer,
      review:userReviewReducer ,
      sales:adminSalesReducer,
      chatBot:userChatBotReducer,
      adminUser:adminUserReducer,
       adminChat: adminChatReducer,
       userChat:userChatReducer
  },
});
