import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import ProfileLayout from './components/ui/ProfileLayout';

import AdminLoginForm from './pages/adminAuth/AdminLogin';
import ForgetPassword from './pages/auth/ForgetPassword';
import Home from './pages/auth/Home';
import LoginForm from './pages/auth/Login';
import VerifyPasswordOtp from './pages/auth/PasswordResetOTP';
import RegisterForm from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import OtpVerify from './pages/auth/VerifyOTP';
import AddAddress from './pages/user/AddAddress';
import Address from './pages/user/Address';
import ChangePassword from './pages/user/ChangePassword';
import EditAddress from './pages/user/EditAddress';
import Profile from './pages/user/Profile';
import AdminDashBoard from './pages/adminAuth/AdminDashbord';


function App() {
 

  return (
    <>
    <Routes>

       <Route path="/" element={<RegisterForm />} />
      <Route path="/terms" element={<div>Terms Page</div>} />
      <Route path="/privacy" element={<div>Privacy Policy</div>} />
       <Route path="/verify-otp" element={<OtpVerify />} />
       <Route path="/login" element={<LoginForm />} />
       <Route path="/forgetpassword" element={<ForgetPassword />} />
       <Route path="/ResetPassword" element={<ResetPassword />} />
       <Route path="/PasswordResetOtp" element={<VerifyPasswordOtp />} />
       <Route path="/ResetPassword" element={<ResetPassword />} />
       
       <Route path="/home" element={
        
          <Home />}/>

       <Route path="/AdminDashBoard" element= { <AdminDashBoard/> }/>
       <Route path="/adminLogin" element= {<AdminLoginForm/>  }/>
    


       <Route path="/profile" element={<ProfileLayout />}>

        <Route index element={<Profile />} />
        <Route path="address" element={<Address />} />
        <Route path="address/add" element={<AddAddress/>  } />
        <Route path="address/edit-address/:addressId" element={<EditAddress />  } />

        <Route path="password" element={<ChangePassword />} />
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
