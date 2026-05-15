import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { AiOutlineEye } from "react-icons/ai";
import { LuEyeClosed } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";
import { showError } from "../../components/ui/Toastify";
import { resetPassword } from "../../Redux/slices/authSlice";

const ResetPassword = ()=>{
 
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
const resetToken= useSelector((state)=>state.auth.resetToken)|| localStorage.getItem('resetToken')
const {error} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();
const navigate = useNavigate()

   const {
      register,
      handleSubmit,
      control,
      formState: { errors }
    } = useForm();

 const password = useWatch({
    control,
    name: 'password'
  });

  const onSubmit= async (data)=>{
      try {
                
               console.log({resetToken:resetToken,newPassword:data.password})
               await dispatch(resetPassword({resetToken:resetToken,newPassword:data.password})).unwrap()

                navigate('/login',{replace:true})
        
      } catch (error) {
      showError(error)
      }

       
       }
    
  
   
return(
  <div className="min-h-screen flex justify-center items-center bg-bg-soft shadow-2xl ">
      
   

      <div className=" w-full md:w-1/3  h-1/2    p-10 m-10  rounded-lg shadow-md bg-bg-main mt-10">
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center font-bold text-text-secondary mt-5'>Reset Password</h1>
         <h6 className='text-xs sm:text-base md:text-sm lg:text-lg xl:text:lg text-center text-primary mt-4 mb-6'>Enter the New Password here.
</h6>
       
         <form onSubmit={handleSubmit(onSubmit)}>

           
          <FormInput
                      label="New Password"
              
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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
          
                    <FormInput
                      label="Confirm New Password"
                      type={showPassword ? "text" : "password"}
                       rightIcon={
    showConfirmPassword ? (
      <AiOutlineEye
        onClick={() => setShowConfirmPassword(false)}
      />
    ) : (
      <LuEyeClosed
        onClick={() => setShowConfirmPassword(true)}
      />
    )
  }
                       required
                      placeholder="Confirm new password"
                      {...register('confirmPassword', {
                        required: 'Confirm password is required',
                        validate: value =>
                          value === password || 'Passwords do not match'
                      })}
                      error={errors.confirmPassword?.message}
                    />
        
                 

                

                     <Button type="submit" fullWidth className='mt-3'>
                    Update Password 
                  </Button>
                  
                   {/* {error} */}

         </form>
    
      </div>
      </div>
    
  );
}

export default ResetPassword
