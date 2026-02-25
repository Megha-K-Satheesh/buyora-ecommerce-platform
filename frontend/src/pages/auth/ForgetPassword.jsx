


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";
import { showError } from "../../components/ui/Toastify";
import { forgotPassword } from "../../Redux/slices/authSlice";


const ForgetPassword = ()=>{
 const navigate = useNavigate()
 const {loading, error, } = useSelector((state)=>state.auth);

 const dispatch = useDispatch()
 useEffect(() => {
  if (error) {
    showError(error);
  }
}, [error]);
   const {
      register,
      handleSubmit,
      
      formState: { errors }
    } = useForm();
  const onSubmit= async (data)=>{
      try {
      const res =   await dispatch(forgotPassword(data)).unwrap()
      console.log(res)
          localStorage.setItem('otpUserId', res.data.userId);
         navigate('/Password-ResetOtp')
      } catch (error) {
        console.log(error)
      }
  }
   
return(
  <div className="min-h-screen flex justify-center items-center bg-pink-50 ">
      
   

      <div className=" w-full md:w-1/3  h-1/2    p-10 m-10  rounded-lg shadow-md bg-white mt-10">
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-bold mt-5'>Forgot Password?</h1>
         <h6 className='text-xs sm:text-base md:text-sm lg:text-lg text-center text-pink-600 mt-4 mb-6'>No worries! Enter your email and 
          we’ll send you a
                                         reset link.
</h6>
       
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
          
                   

                

                    <Button type="submit" fullWidth className='mt-3'>
                      {loading ? "Sending OTP..." : "Send OTP"}
                </Button>

                  
                    <div className="mt-6 text-center text-lg text-gray-600">
                        Remember the Password?{" "}
                        <Link
                          to="/login"
                          className="text-pink-600 font-medium hover:underline"
                        >
                          Sign In
                        </Link>
                    </div>
                    

         </form>
    
      </div>
      </div>
    
  );
}

export default ForgetPassword
