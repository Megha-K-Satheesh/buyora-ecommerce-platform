import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import AddCategoryForm from "./pages/admin/category/AddCategory";
import UpdateCategoryForm from "./pages/admin/category/UpdateCategory";
// import AddProducts from "./pages/admin/products/AddProducts";
import AddBrand from "./pages/admin/brand/addBrand";
import CartPage from "./pages/publicPages/CartPage";
import Home from "./pages/publicPages/Home";
import ProductListingPage from "./pages/publicPages/ProductListingPage";
import SingleProductPage from "./pages/publicPages/SingleProductPage";
import EditProduct from "./pages/admin/products/UpdateProduct";
const AdminLayouts = lazy(() => import("./layouts/AdminLayouts"));
const Banners = lazy(() => import("./pages/admin/banner/Banners"));
const Category = lazy(() => import("./pages/admin/category/Categories"));
const Coupons = lazy(() => import("./pages/admin/coupons/Coupons"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const Orders = lazy(() => import("./pages/admin/orders/Orders"));
const Products = lazy(() => import("./pages/admin/products/Products"));
const AddProducts = lazy(() => import("./pages/admin/products/AddProducts"));


const Report = lazy(() => import("./pages/admin/report/Report"));
const Users = lazy(() => import("./pages/admin/user/Users"));

const RegisterForm = lazy(() => import("./pages/auth/Register"));
const LoginForm = lazy(() => import("./pages/auth/Login"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyOtpPage = lazy(() => import("./pages/auth/VerifyOTP"));
const VerifyPasswordOtp = lazy(() =>
  import("./pages/auth/PasswordResetOTP")
);


const AdminLoginForm = lazy(() =>
  import("./pages/adminAuth/AdminLogin")
);

const ProfileLayout = lazy(() => import("./layouts/ProfileLayout"));
const Profile = lazy(() => import("./pages/user/profile/Profile"));
const Address = lazy(() => import("./pages/user/address/Address"));
const AddAddress = lazy(() =>
  import("./pages/user/address/AddAddress")
);
const EditAddress = lazy(() =>
  import("./pages/user/address/EditAddress")
);
const ChangePassword = lazy(() =>
  import("./pages/user/ChangePassword")
);

function App() {
  return (
    <>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<ProductListingPage />} />
          <Route path="/:level1/:level2/:level3?" element={<ProductListingPage/>  }/>
          <Route path="/product/:slug/:id" element={<SingleProductPage />} />
          <Route path="/product/cart" element={<CartPage />} />
          
           
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/password-resetOtp"
            element={<VerifyPasswordOtp />}
          />
          <Route path="/terms" element={<div>Terms Page</div>} />
          <Route path="/privacy" element={<div>Privacy Policy</div>} />
          
          <Route
            path="/admin-login"
            element={<AdminLoginForm />}
          />


          <Route path="/admin-dashboard" element={<AdminLayouts />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="/admin-dashboard/products/add-product" element={<AddProducts/>}/>
          <Route
  path="/admin-dashboard/products/update-product/:id"
  element={<EditProduct />}
/>
          <Route path="brands" element={<AddBrand/>}/>

          <Route path="categories" element={<Category />} />
          <Route path = "/admin-dashboard/categories/add-category" element={<AddCategoryForm/>}/>
           <Route path ="/admin-dashboard/categories/update-category/:categoryId" element={<UpdateCategoryForm/>}/> 
          <Route path="orders" element={<Orders />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="users" element={<Users />} />
          <Route path="banners" element={<Banners />} />
          <Route path="sales-report" element={<Report />} />
        
        </Route>

          <Route path="/account" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="address" element={<Address />} />
            <Route
              path="address/add-address"
              element={<AddAddress />}
            />
            <Route
              path="address/edit-address/:addressId"
              element={<EditAddress />}
            />
            <Route
              path="change-password"
              element={<ChangePassword />}
            />
          </Route>
       
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;

