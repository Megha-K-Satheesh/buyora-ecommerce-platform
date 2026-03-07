const express = require('express');
const { optionalAuth, authenticateUser } = require('../middlewares/auth');
const userCouponController = require('../controllers/user/userCouponController');

const router = express.Router();


 router.post('/verify-coupon',optionalAuth,userCouponController.verifyCoupon)
router.post(
  '/remove-coupon',
  authenticateUser,
  userCouponController.removeCoupon
);

router.get('/get-all-coupons',authenticateUser,userCouponController.getCoupons)
module.exports = router
