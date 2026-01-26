import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import FormCheckbox from '../../components/ui/FormCheckbox';
import FormInput from '../../components/ui/FormInput';
import Logo from '../../components/ui/Logo';
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
    <div className="min-h-screen flex justify-evenly bg-gradient-to-br from-sky-400 via-sky-300 to-amber-300 ">
      
        

      <div className=" w-full md:w-2/5     p-6 m-10  rounded-lg shadow-md bg-white mt-10">

            <Logo
              
              className="m-auto my-0"
            />
        

        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-gray-700 font-medium  mt-5'>Create Your Account</h1>
         <h6 className='text-sm sm:text-base md:text-sm lg:text-lg text-center text-sky-700 mt-2 mb-3 h'>Join Buyora and start shopping smarter</h6>
        <form onSubmit={handleSubmit(onSubmit)}>

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
            
            />

          <FormInput
            label="Last Name"
            placeholder="Enter last name"
             required
            {...register('lastName', {
              required: 'Last name is required'
            })}
            error={errors.lastName?.message}
          />

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
                <Link to="/terms" className="text-blue-600">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600">Privacy Policy</Link>
              </span>
            }
            error={errors.agreeToTerms?.message}
            />

          <Button type="submit" fullWidth className='mt-3'>
            Register
          </Button>
            <div className="flex items-center my-4 sm:my-5 md:my-6">
              <hr className="flex-grow border-gray-200" />
              <span className="mx-2 sm:mx-3 text-xs sm:text-sm text-gray-500">
                              or
              </span>
              <hr className="flex-grow border-gray-200" />
            </div>

          <Button type='button' fullWidth className='mt-4 text-black' variant='outline'>
            Continue with Google

          </Button>
            <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
            </div>

        </form>
      </div>
      </div>
    
  );
};

export default RegisterForm;
