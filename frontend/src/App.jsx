import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Home from "./pages/auth/Home";

const RegisterForm = lazy(() => import("./pages/auth/Register"));
const LoginForm = lazy(() => import("./pages/auth/Login"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyOtpPage = lazy(() => import("./pages/auth/VerifyOTP"));
const VerifyPasswordOtp = lazy(() =>
  import("./pages/auth/PasswordResetOTP")
);

const AdminDashBoard = lazy(() =>
  import("./pages/adminAuth/AdminDashbord")
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
            path="/admin-dashBoard"
            element={<AdminDashBoard />}
          />
          <Route
            path="/admin-login"
            element={<AdminLoginForm />}
          />
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

