const User = require('../models/User');
const { generateUserToken, generateResetToken, verifyResetToken } = require('../utils/jwt');
const logger = require('../utils/logger');
const { ConflictError, ValidationError, GenericError ,ErrorFactory} = require('../utils/errors');

const { generateOtp, sendOtpEmail } = require('../utils/nodeMailer');


class AuthService {


          static async register(userData) {
          const { name, email, password } = userData;

          const existingUser = await User.findByEmail(email);
          if (existingUser) {
            throw  ErrorFactory.conflict('User already exists');
          }

          const user = new User({ name, email, password });
          await user.save();

          
          const otpDetails = generateOtp('EMAIL_VERIFICATION');

          user.otpDetails = otpDetails;
          await user.save();

          
          sendOtpEmail(user,otpDetails.code);

          return {
            message: 'OTP sent to your email',
            userId: user._id
          };
        }

                  
       
        
   static async verifyOtp(data) {
  const { userId, otp, purpose } = data;

  const user = await User.findById(userId);
  if (!user){
      throw ErrorFactory.notFound('User not found');
  }

  if (!user.otpDetails || user.otpDetails.purpose !== purpose) {
    throw ErrorFactory.validation('Invalid OTP request');
  }

  if (Date.now() > user.otpDetails.expiresAt) {
    throw  ErrorFactory.expiredOtp('OTP expired');
  }

  const isValidOtp = await user.compareOtp(otp);
  if (!isValidOtp) {
      throw ErrorFactory.invalidOtp('Invalid OTP');
  }

  user.isVerified = true;
  user.otpDetails = undefined;
  await user.save();
  const token = generateUserToken({
    id: user._id,
    email: user.email,
    role: user.role
  });

  return {
    message: 'Email verified successfully',
    user: user.getPublicProfile(),
    token
  };
}
  
   static async verifyPasswordResetOtp(data){
       const {userId,otp,purpose} = data;
       
       console.log(userId);
       console.log(purpose,otp);
       const user = await User.findById(userId);
       
       if(!user){
        throw ErrorFactory.notFound('User not found')
       }
       if(!user.otpDetails   ){ 
        throw ErrorFactory.validation('Invalid otp request')
       }
       if( user.otpDetails.purpose !== purpose  ){ 
        throw ErrorFactory.validation('Invalid Purpose request')
       }
       if(Date.now() > user.otpDetails.expiresAt){
        throw ErrorFactory.expiredOtp('Otp is exprired')
       }
       const isValidOtp = await user.compareOtp(otp);
       if(!isValidOtp){
        throw ErrorFactory.invalidOtp('Invalid OTP')
       }
       user.otpDetails = undefined;
       await user.save()

      const resetToken = generateResetToken({
        id:user._id,
        email:user.email,
        purpose:'PASSWORD_RESET'
      });
      return{
        message:'OTP verified successfully. You can now reset your password',
        resetToken
      }
   }


 static async resendOtp(data) {
    const { userId, purpose } = data;

    if (!userId) throw ErrorFactory.validation('User ID is required');
   

    const user = await User.findById(userId);
    if (!user) throw ErrorFactory.notFound('User not found');

    if (purpose === 'EMAIL_VERIFICATION' && user.isVerified) {
      throw ErrorFactory.conflict('Email already verified');
    }

    const otpDetails = generateOtp(purpose);

    user.otpDetails = otpDetails;
    await user.save();

    await sendOtpEmail(user, otpDetails.code);

    return {
      message: 'OTP sent successfully',
      userId: user._id
    };
  }


static async forgotPasswordRequest(data){
   try {
        const {email} = data;
       const user = await User.findByEmail(email);
       if(!user){
          throw ErrorFactory.notFound("User not found")
       }
       if(user.status === 'banned'){
        throw ErrorFactory.userBanned("Your account has been banned. Please contact administrator")
       }

       const otpDetails = generateOtp('PASSWORD_RESET')
       console.log(otpDetails)
       user.otpDetails = otpDetails;
      await user.save()
      await sendOtpEmail(user,otpDetails.code)
     return{
        userId:user._id,
        purpose:user.otpDetails.purpose

     }
   } catch (error) {
       logger.info("Forgot password error",error)
       throw error
   }    
}
   
 static async resetPassword(data){
 
   if (!data) throw ErrorFactory.validation("No data provided");
  const {resetToken,newPassword} = data;
   if (!resetToken || !newPassword) {
    throw ErrorFactory.validation("Reset token and new password are required");
  }

  console.log("Reset Token:", resetToken, "New Password:", newPassword);
    const decoded =verifyResetToken(resetToken);

    if(!decoded || decoded.purpose !=='PASSWORD_RESET'){
      throw ErrorFactory.validation('Invalid request')
    }
    const user = await User.findById(decoded.id);
    if(!user){
      throw ErrorFactory.notFound("User not fount")
    }
    user.password = newPassword
    await user.save()
 
    return {
      message:'Password reset successfull'
    }
 }
 

  static async login(credentials) {
    try {
      const { email, password } = credentials;

      const user = await User.findByEmail(email);
      if (!user) {
        throw ErrorFactory.notFound('User not found')
      }

      if (user.status === 'banned') {
         throw ErrorFactory.userBanned('Your account has been banned. Please contact administrator');
      }
        
       if (!user.isVerified) {
       throw  ErrorFactory.authorization('Please verify your email before logging in');
     }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
          throw ErrorFactory.authentication('Invalid email or password');
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role
      });

      logger.info(`User logged in: ${email}`);

      return {
        user: user.getPublicProfile(),
        token
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

}

module.exports = AuthService;
