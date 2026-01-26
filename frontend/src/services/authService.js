import apiClient from '../utils/apiClient';

export const authService = {
  register(data) {
    return apiClient.post('/auth/register', data);
  },

  verifyOtp(data) {
    return apiClient.post('/auth/verify-otp', data);
  },
  
    resendOtp(data) {
   return apiClient.post('/auth/resend-otp', data);
  },
  forgotPassword(data){
    return apiClient.post('/auth/forgot-password',data)
  },
  verifyPasswordResetOtp(data){
    return apiClient.post('auth/verify-password-reset-otp',data)
  },
  resetPassword(data){
    return apiClient.post('/auth/reset-password',data)
  },
  login(data){
     return apiClient.post('/auth/login',data)
  }
};
