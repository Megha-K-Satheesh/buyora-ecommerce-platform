import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye } from "react-icons/ai";
import { LuEyeClosed } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import FormCheckbox from "../../components/ui/FormCheckbox";
import FormInput from "../../components/ui/FormInput";
import Navbar from "../../components/ui/Navbar";
import { showError, showSuccess } from "../../components/ui/Toastify";
import { googleLogin, login } from "../../Redux/slices/authSlice";
import { connectSocket } from "../../utils/socket";
const LoginForm = ()=>{
   
     const dispatch = useDispatch()
     const navigate = useNavigate()
     const [showPassword, setShowPassword] = useState(false);
     const location = useLocation()
      const { error, loginLoading, isAuthenticated } = useSelector((state) => state.auth);
     const from = location.state?.from?.pathname || "/"


   const {
      register,
      handleSubmit,
     formState: { errors }
    } = useForm();


       useEffect(() => {
        if (error) showError(error);
         }, [error]);


           
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);
     const onSubmit= async (data)=>{
      try {
          const res = await dispatch(login({email:data.email,password:data.password})).unwrap()
          showSuccess("Successfully logined")
             connectSocket();
       
      } catch (err) {
        showError(err)
      }
  }
   
return(
  <>
  <div className=" min-h-screen flex justify-evenly bg-bg-soft ">
      
    <Navbar/>

      <div className=" w-full md:w-1/3  h   p-10 m-10  rounded-lg bg-bg-main shadow-sm mt-35">
        
         {/* <Logo className="m-auto my-0"/> */}
        <h1 className='text-xl sm:text-2xl md:text-2xl lg:text-3xl text-center text-text-secondary font-medium mt-6'>Welcome Back !</h1>
         <h6 className='text-sm sm:text-base md:text-lg lg:text-xl text-center text-primary mt-2 mb-6'>Sign in to Buyora and start shopping smarter</h6>


        

         <form onSubmit={handleSubmit(onSubmit)}>

             <FormInput
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                       required

                        
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors.email?.message}
                    />
          
                    <FormInput
                      label="Password"
                     type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                       required
                       rightIcon={
    showPassword ? (
      <AiOutlineEye
      
        onClick={() => setShowPassword(false)}
      />
    ) : (
      <LuEyeClosed 
        onClick={() => setShowPassword(true)}
      />
    )
  }
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        },
                        pattern: {
                          value: /^(?=.*[0-9])(?=.*[A-Z]).*$/,
                          message: 'Must contain a number and uppercase letter'
                        }
                      })}
                      error={errors.password?.message}
                    />

                  <div className="flex justify-between mt-3 ">
                         <FormCheckbox
                
                   {...register('agreeToTerms', {
                                    
                   })}
                   label={
                <span>
                Remerber me{' '}
                </span>
            }
            error={errors.agreeToTerms?.message}
            />

            <p className="text-sm text-primary hover:text-primary-hover"><Link to='/forget-password'>Forget Password?</Link></p>
                  </div>


                     <Button type="submit" fullWidth className='mt-3'>
                       {loginLoading ? "Loading...":"Login"}
                  </Button>
                  <p className='flex justify-center mt-2.5 text-text-muted'>or</p>
                  
<div className="mt-3 w-full flex justify-center">
  <GoogleLogin
text="continue_with"

    onSuccess={async (response) => {

      const idToken = response.credential;
      if (!idToken) {
        return showError("Google token is missing");
      }

    

   
      try {
         await dispatch(googleLogin({ idToken })).unwrap();

      
        showSuccess("Google login successful");

      
        navigate("/",{replace:true});
      } catch (err) {
        
        showError(err);
      }
    }}
    onError={() => showError("Google login failed")}
    useOneTap={false} 
  />
</div> 
                    <div className="mt-4 text-center text-sm text-text-muted">
                        Don't have an account?{" "}
                        <Link
                          to="/register"
                          className="text-primary hover:text-primary-hover  font-medium hover:underline"
                        >
                          Sign Up
                        </Link>
                    </div>

         </form>
                   
         </div>
      </div>
      <Footer/>
      </>
  );
}

export default LoginForm
