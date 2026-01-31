import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import ProfileLayout from './layouts/ProfileLayout';
import AdminDashBoard from './pages/adminAuth/AdminDashbord';
import AdminLoginForm from './pages/adminAuth/AdminLogin';
import ForgetPassword from './pages/auth/ForgetPassword';
import Home from './pages/auth/Home';
import LoginForm from './pages/auth/Login';
import VerifyPasswordOtp from './pages/auth/PasswordResetOTP';
import RegisterForm from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOtpPage from './pages/auth/VerifyOTP';
import AddAddress from './pages/user/address/AddAddress';
import Address from './pages/user/address/Address';
import EditAddress from './pages/user/address/EditAddress';
import ChangePassword from './pages/user/ChangePassword';
import Profile from './pages/user/profile/Profile';



function App() {
 

  return (
    <>
    
    <Routes>

       <Route path="/" element={ <Home />}/>
       <Route path="/register" element={<RegisterForm />} />
      <Route path="/terms" element={<div>Terms Page</div>} />
      <Route path="/privacy" element={<div>Privacy Policy</div>} />
       <Route path="/verify-otp" element={<VerifyOtpPage />} />
       <Route path="/login" element={<LoginForm />} />
       <Route path="/forget-password" element={<ForgetPassword />} />
       <Route path="/reset-Password" element={<ResetPassword />} />
       <Route path="/password-resetOtp" element={<VerifyPasswordOtp />} />
       {/* <Route path="/ResetPassword" element={<ResetPassword />} /> */}
       

       <Route path="/admin-dashBoard" element= { <AdminDashBoard  /> }/>
       <Route path="/admin-login" element= {<AdminLoginForm/>  }/>
       
       

       <Route path="/account" element={<ProfileLayout />}>

        <Route index  element={<Profile />} />
        <Route  path='profile' element={<Profile />} />
        <Route path="address" element={<Address />} />
        <Route path="address/add-address" element={<AddAddress/>  } />
        <Route path="address/edit-address/:addressId" element={<EditAddress />  } />

        <Route path="change-password" element={<ChangePassword />} />
        
        
      </Route>

       
    </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
   
    </>
  )
}

export default App
