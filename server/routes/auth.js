const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/auth');
const checkUserStatus = require('../middlewares/checkUserStatus');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/resend-otp', AuthController.resendOtp);
 router.post('/login', checkUserStatus, AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword)
 router.post('/verify-password-reset-otp',AuthController.verifyPasswordResetOpt)
 router.post('/reset-password',AuthController.resetPassword)


module.exports = router;
