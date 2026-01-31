const BaseController = require('./BaseController');
const { AuthService } = require('../services');
const { registerValidation, loginValidation, profileUpdateValidation, passwordChangeValidation, resetPasswordValidation, forgotPasswordValidation, verifyForgotOtpValidation, verifyOtpValidation, resendOtpValidation } = require('../utils/validation');
const { forgotPasswordRequest } = require('../services/AuthService');

class AuthController extends BaseController {

          
        static register = BaseController.asyncHandler(async (req, res) => {
       
          const validatedData = BaseController.validateRequest(registerValidation, req.body);
          const result = await AuthService.register(validatedData);

          BaseController.logAction('USER_REGISTER', null);
          BaseController.sendSuccess(res, result.message, result, 201);
        });

        static verifyOtp = BaseController.asyncHandler(async (req, res) => {
          const validateData = BaseController.validateRequest(verifyOtpValidation,req.body)
          const result = await AuthService.verifyOtp(validateData);

          BaseController.logAction('EMAIL_VERIFICATION', result.user);
          BaseController.sendSuccess(res, result.message, result);
        });
        
        
        static forgotPassword =BaseController.asyncHandler(async(req,res)=>{
          const validatedData = BaseController.validateRequest(forgotPasswordValidation,req.body);
          const result =  await AuthService.forgotPasswordRequest(validatedData)
          BaseController.logAction('FORGOT_PASSWORD_REQUEST',null)
          BaseController.sendSuccess(res,result.message,result)
        })



        static verifyPasswordResetOpt = BaseController.asyncHandler(async(req,res)=>{
          //  const validateDate = BaseController.validateRequest(verifyForgotOtpValidation,req.body);
            const validateData = BaseController.validateRequest(verifyOtpValidation,req.body)
           const result = await AuthService.verifyPasswordResetOtp(validateData)

           BaseController.logAction('PASSWORD_RESET_OTP_VERIFIED',result.user)
           BaseController.sendSuccess(res,result.message,result)
        })

      


         static resendOtp = BaseController.asyncHandler(async (req, res) => {
           const validateData = BaseController.validateRequest(resendOtpValidation,req.body)
            const result = await AuthService.resendOtp(validateData);
            
            BaseController.logAction('RESEND_OTP', result.userId );
                              
            BaseController.sendSuccess(res, result.message, result);
         });
                                        
                              
          static resetPassword = BaseController.asyncHandler(async (req,res)=>{
         
             const validateData = BaseController.validateRequest(resetPasswordValidation
              ,req.body
             )
           
             const result = await AuthService.resetPassword(validateData);
             BaseController.logAction('PASSWORD_RESET',result)
             BaseController.sendSuccess(res,result.message,result)
          })                    

        
                              
                                     

         static login = BaseController.asyncHandler(async (req, res) => {
          console.log(req.body)
           const validatedData = BaseController.validateRequest(loginValidation, req.body);
           const result = await AuthService.login(validatedData);
           BaseController.logAction('USER_LOGIN', result.user);
           BaseController.sendSuccess(res, 'Login successful', result);
         });
       
    
        //  static logout = BaseController.asyncHandler(async (req, res) => {
        //    BaseController.logAction('USER_LOGOUT', req.user);
        //    BaseController.sendSuccess(res, 'Logged out successfully');
        //  });
       }
       
       module.exports = AuthController;



        






