




import { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";


import { AdminRoute, UserRoute } from "./components/protectedRoutes/ProtectedRoutes";




const Home = lazy(() => import("./pages/publicPages/Home"));
const CartPage = lazy(() => import("./pages/publicPages/CartPage"));
const ProductListingPage = lazy(() => import("./pages/publicPages/ProductListingPage"));
const SingleProductPage = lazy(() => import("./pages/publicPages/SingleProductPage"));
const AddReviewPage = lazy(() => import("./pages/publicPages/AddReviewPage"));

const WishlistLayout = lazy(() => import("./layouts/WishlistLayout"));
const NavbarOrderLayout = lazy(() => import("./layouts/OrderLayout"));

const ChatWidget = lazy(() => import("./components/ui/ChatWidGet"));




// Auth pages
const RegisterForm = lazy(() => import("./pages/auth/Register"));
const LoginForm = lazy(() => import("./pages/auth/Login"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyOtpPage = lazy(() => import("./pages/auth/VerifyOTP"));
const VerifyPasswordOtp = lazy(() => import("./pages/auth/PasswordResetOTP"));

// Admin Auth
const AdminLoginForm = lazy(() => import("./pages/adminAuth/AdminLogin"));

// Admin pages
const AdminLayouts = lazy(() => import("./layouts/AdminLayouts"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const Products = lazy(() => import("./pages/admin/products/Products"));
const AddProducts = lazy(() => import("./pages/admin/products/AddProducts"));
const EditProduct = lazy(() => import("./pages/admin/products/UpdateProduct"));
const Category = lazy(() => import("./pages/admin/category/Categories"));
const AddCategoryForm = lazy(() => import("./pages/admin/category/AddCategory"));
const UpdateCategoryForm = lazy(() => import("./pages/admin/category/UpdateCategory"));
const Orders = lazy(() => import("./pages/admin/orders/Orders"));
 const Users = lazy(() => import("./pages/admin/user/Users"));
const Banners = lazy(() => import("./pages/admin/banner/Banners"));
const AddBanner = lazy(() => import("./pages/admin/banner/AddBanner"));
const EditBanner = lazy(() => import("./pages/admin/banner/UpdateBanner"));
const Coupons = lazy(() => import("./pages/admin/coupons/Coupons"));
const AddCoupon = lazy(() => import("./pages/admin/coupons/AddCoupon"));
const EditCoupon = lazy(() => import("./pages/admin/coupons/EditCoupon"));
const Report = lazy(() => import("./pages/admin/report/Report"));
const AddBrand = lazy(() => import("./pages/admin/brand/addBrand"));

// User pages
const ProfileLayout = lazy(() => import("./layouts/ProfileLayout"));
const Profile = lazy(() => import("./pages/user/profile/Profile"));
const Address = lazy(() => import("./pages/user/address/Address"));
const AddAddress = lazy(() => import("./pages/user/address/AddAddress"));
const EditAddress = lazy(() => import("./pages/user/address/EditAddress"));

const AllOrdersPage = lazy(() => import("./pages/user/order/AllOrderPage"));
const SingleOrderPage = lazy(() => import("./pages/user/order/SingleOrderView"));
const CheckoutPage = lazy(() => import("./pages/user/checkout/checkout"));
const OrderSuccessPage = lazy(() => import("./pages/user/checkout/OrderSuccessPage"));
const Wallet = lazy(() => import("./pages/user/wallet/walletDisplay"));
const CouponsList = lazy(() => import("./pages/user/coupon/UserCoupons"));

// UI components

import NotFound from "./components/ui/NotFount";
import ServerError from "./components/ui/ServerError";

import Loader from "./components/ui/Loader";
import { getCartBackend, setCart } from "./Redux/slices/cartSlice";
import { getUserProfile } from "./Redux/slices/userSlice";
import { connectSocket, listenUserStatus } from "./utils/socket";

const Brand = lazy(() => import("./pages/admin/brand/Brand"));
const UpdateBrand = lazy(() => import("./pages/admin/brand/UpdateBrand"));


const AdminOrderView = lazy(() =>
  import("./pages/admin/orders/AdminOrderView")
);

const EditProfile = lazy(() =>
  import("./pages/user/profile/EditProfile")
);

const AdminRealtimeChat = lazy(() =>
  import("./pages/admin/contact/AdminRealtimeChat")
);

const UserRealtimeChat = lazy(() =>
  import("./pages/user/contact/UserRealTimeChat")
);

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const showChat = !location.pathname.includes("/admin");

  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(getUserProfile());
      dispatch(getCartBackend());
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      dispatch(setCart(cart));
    }
  }, [dispatch]);



useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const socket = connectSocket();
  if (!socket) return;

  const cleanup = listenUserStatus(
    (data) => {
      console.log("BANNED:", data);

      localStorage.removeItem("authToken");
      window.location.href = "/login";
    },
    (data) => {
      console.log("FORCE LOGOUT:", data);

      localStorage.removeItem("authToken");
      window.location.href = "/login";
    },
    (data) => {
      console.log("UNBANNED:", data);

      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  );

  return () => {
    cleanup?.(); 
  };
}, []);
  return (
    <>
      <Suspense fallback={<Loader/>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<ProductListingPage />} />
          <Route path="/:level1/:level2/:level3?" element={<ProductListingPage />} />
          <Route path="/product/:slug/:id" element={<SingleProductPage />} />
          <Route path="/product/cart" element={<CartPage />} />
          <Route path="/add-review/:productId" element={<AddReviewPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-resetOtp" element={<VerifyPasswordOtp />} />
          <Route path="/terms" element={<div>Terms Page</div>} />
          <Route path="/privacy" element={<div>Privacy Policy</div>} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />

          {/* User Protected Routes */}
          <Route path="/product/checkout" element={<UserRoute><CheckoutPage /></UserRoute>} />
          <Route path="/order-success/:orderId" element={<UserRoute><OrderSuccessPage /></UserRoute>} />
          <Route path="/all-orders" element={<UserRoute><NavbarOrderLayout /></UserRoute>} />
          <Route path="/orders/:orderId" element={<UserRoute><SingleOrderPage /></UserRoute>} />
          <Route path="/products/wishlist" element={<UserRoute><WishlistLayout /></UserRoute>} />
           <Route path="user-chat" element={<UserRealtimeChat/>}/>
          <Route path="/account" element={<UserRoute><ProfileLayout /></UserRoute>}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit-profile" element={<EditProfile />} />
            <Route path="address" element={<Address />} />
            <Route path="address/add-address" element={<AddAddress />} />
            <Route path="address/edit-address/:addressId" element={<EditAddress />} />
           
            <Route path="all-orders" element={<AllOrdersPage />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="user-coupons" element={<CouponsList />} />
            
          </Route>

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLoginForm />} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminLayouts /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add-product" element={<AddProducts />} />
            <Route path="products/update-product/:id" element={<EditProduct />} />
            <Route path="brands" element={<Brand />} />
            <Route path="brands/add-brand" element={<AddBrand />} />
            <Route path="brands/update-brand/:brandId" element={<UpdateBrand />} />
            <Route path="categories" element={<Category />} />
            <Route path="categories/add-category" element={<AddCategoryForm />} />
            <Route path="categories/update-category/:categoryId" element={<UpdateCategoryForm />} />
            <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<AdminOrderView />} />
              <Route path="users/chat/:userId" element={<AdminRealtimeChat />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/add-coupon" element={<AddCoupon />} />
            <Route path="coupons/edit-coupon/:couponId" element={<EditCoupon />} />
            <Route path="users" element={<Users />} />
            <Route path="banners" element={<Banners />} />
            <Route path="banners/add-banner" element={<AddBanner />} />
            <Route path="banner/update-banner/:id" element={<EditBanner />} />
            <Route path="sales-report" element={<Report />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Toast notifications */}
      <ToastContainer position="top-center" autoClose={3000} pauseOnHover draggable />

     
      {showChat && <ChatWidget />}
    </>
  );
}

export default App;
