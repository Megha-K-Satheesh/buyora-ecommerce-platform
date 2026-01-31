import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Footer from '../../components/ui/Footer';
import FormCheckbox from '../../components/ui/FormCheckbox';
import FormInput from '../../components/ui/FormInput';
import Navbar from '../../components/ui/Navbar';
import { showError, showSuccess } from '../../components/ui/Toastify';
import { registerUser } from '../../Redux/slices/authSlice';

const RegisterForm = () => {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

    
  
  const onSubmit = async (data) => {
    try {
      
      const res = await dispatch(registerUser(data)).unwrap()
      
          navigate('/verify-otp');
          showSuccess("Registration Successfull")
    } catch (err) {
        showError(err)
    }
     
  };

  return (
    <>
 
    <Navbar/>
    <div className=" flex h-[100vh]

    justify-center  items-start lg:bg-[#FFF1F6]
     mt-20
  ">

      <div className='   
     lg:bg-gradient-to-b from-rose-500  to-pink-500 
lg:shadow-[0_9px_20px_-10px_rgba(0,0,0,0.25)] 
      flex lg:w-[40%] w-[90%] rounded-2xl mt-10'>

      {/* <div className=' lg:flex lg:flex-1  justify-center lg:items-center  hidden  '>
         <div className='flex '>

        <WelcomeText
      title={"Welcome To Buyora"}
      subtitle={"Create Your Account Here"}
      />
      </div>
      </div> */}

      <div className="  md:w-2/5   lg:px-5  flex-1 bg-white   rounded-r-2xl ">

            {/* <Logo
              
              className="mx-auto lg:mt-2  mb-6"
            /> */}
        

        <h1 className='text-xl sm:text-2xl md:text-2xl lg:text-3xl text-center text-gray-700 font-medium  py-5'>Create Your Account</h1>
         <h6 className='text-sm sm:text-base md:text-sm lg:text-lg text-center text-pink-600 font-medium mt-2 mb-3 h'>Join Buyora and start shopping smarter</h6>
        <form onSubmit={handleSubmit(onSubmit)} className='mx-5 mt-10  '>
          <div className='flex justify-between'>
           <div className=' flex-1 mr-4 '>

          <FormInput
            label="First Name"
            placeholder="Enter first name"
            required
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'Minimum 2 characters'
              }
            })}
            error={errors.firstName?.message}
           className="w-30"
            />
           </div>
           <div className=' flex-1'>

          <FormInput
            label="Last Name"
            placeholder="Enter last name"
            required
            {...register('lastName', {
              required: 'Last name is required'
            })}
            error={errors.lastName?.message}
            />
           </div>
          </div>

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

          <FormInput
            label="Confirm Password"
            type="password"
            required
            placeholder="Confirm password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: value =>
                value === password || 'Passwords do not match'
            })}
            error={errors.confirmPassword?.message}
            />

          <FormCheckbox
           required
            
           {...register('agreeToTerms', {
             required: 'You must agree to continue'
             
            })}
            label={
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-pink-500 ">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-pink-500 ">Privacy Policy</Link>
              </span>
            }
            error={errors.agreeToTerms?.message}
            />

          <Button type="submit" fullWidth className='lg:text-lg'>
            Register
          </Button>
            <div className="flex items-center my-3">
              <hr className="flex-grow border-gray-200" />
              <span className="lg:mx-2  sm:mx-3 text-xs sm:text-sm text-gray-500">
                              or
              </span>
              <hr className="flex-grow border-gray-200" />
            </div>

          <Button type='button' fullWidth className=' text-black lg:text-lg' variant='outline'>
            Continue with Google

          </Button>
            <div className="mt-4 mb-4 text-center lg:text-lg text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-pink-600 font-medium hover:underline"
                  >
                  Sign in
                </Link>
            </div>

        </form>
      </div>
    </div>
      </div>
      <Footer>
        <Footer/>
      </Footer>
     </>
  );
};

export default RegisterForm;
