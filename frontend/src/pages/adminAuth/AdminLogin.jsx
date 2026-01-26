import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import Button from "../../components/ui/Button";
import FormCheckbox from "../../components/ui/FormCheckbox";
import FormInput from "../../components/ui/FormInput";
import Logo from "../../components/ui/Logo";
import { showError, showSuccess } from "../../components/ui/Toastify";
import { adminLogin } from "../../Redux/slices/adminAuthSlice";


const  AdminLoginForm = ()=>{
     const error = useSelector((state)=>state.adminAuth.error)
     const loading = useSelector((state)=>state.adminAuth.loading)
     const dispatch = useDispatch()
     const navigate = useNavigate()
   const {
      register,
      handleSubmit,
     formState: { errors }
    } = useForm();


      //  useEffect(() => {
      //   if (error) showError(error);
      //    }, [error]);

     const onSubmit= async (data)=>{
      try {
          const res = await dispatch(adminLogin({email:data.email,password:data.password})).unwrap()
          showSuccess("Successfully logined")
         
         navigate('/AdminDashBoard')
      } catch (err) {
        showError(err)
      }
  }
   
return(
  <div className="min-h-screen flex justify-evenly bg-gradient-to-br from-sky-400 via-sky-300 to-amber-300 ">
      
   

      <div className=" w-full md:w-1/3     p-10 m-10  rounded-lg shadow-md bg-white mt-10">
        
         <Logo className="m-auto my-0"/>
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-bold mt-6'>Welcome Back Admin !</h1>
         <h6 className='text-sm sm:text-base md:text-lg lg:text-xl text-center text-sky-400 mt-2 mb-6'>  Sign in to your admin dashboard to manage users and products </h6>
       
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
                      type="password"
                      placeholder="Enter password"
                       required
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

            <p className="text-sm text-blue-600"><Link to='/forgetpassword'>Forget Password?</Link></p>
                  </div>


                     <Button type="submit" fullWidth className='mt-3'>
                       {loading ? "Loading...":"Login"}
                  </Button>
                  <p className='flex justify-center mt-2.5'>or</p>
                  <Button type='button' fullWidth className='mt-4 text-black' variant='outline'>
                    GOOGLE
                  </Button>
                    {/* <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                          to="/"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Sign Up
                        </Link>
                    </div> */}

         </form>
                   
      </div>
    </div>
  );
}

export default AdminLoginForm
