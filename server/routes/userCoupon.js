const express = require('express');
const { optionalAuth } = require('../middlewares/auth');
const userCouponController = require('../controllers/user/userCouponController');

const router = express.Router();


 router.post('/verify-coupon',optionalAuth,userCouponController.verifyCoupon)

module.exports = router
