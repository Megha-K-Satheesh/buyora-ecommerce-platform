const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/auth');
const checkUserStatus = require('../middlewares/checkUserStatus');
const { createAuthLimiter } = require('../middlewares/setup');
const authLimiter = createAuthLimiter()
const router = express.Router();

router.post('/register',authLimiter, AuthController.register);
router.post('/verify-otp',authLimiter, AuthController.verifyOtp);
router.post('/resend-otp',authLimiter, AuthController.resendOtp);
 router.post('/login',authLimiter, checkUserStatus, AuthController.login);
router.post('/forgot-password',authLimiter, AuthController.forgotPassword)
 router.post('/verify-password-reset-otp',authLimiter,AuthController.verifyPasswordResetOpt)
 router.post('/reset-password',authLimiter,AuthController.resetPassword)
router.post('/google-login',authLimiter, checkUserStatus,AuthController.googleLogin);  

module.exports = router;
