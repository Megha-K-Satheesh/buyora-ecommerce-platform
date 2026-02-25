

const express = require('express');
const { authenticateAdmin } = require('../middlewares/auth');
const CouponController = require('../controllers/coponController');

const router = express.Router();

router.post('/add-coupon',authenticateAdmin,CouponController.addCoupon)
router.get('/get-coupons',authenticateAdmin,CouponController.getCouponsList)
router.get('/get-coupon/:id', authenticateAdmin, CouponController.getCouponById);
router.put('/update-coupon/:id', authenticateAdmin, CouponController.updateCoupon);
router.delete('/delete-coupon/:id', authenticateAdmin, CouponController.deleteCoupon);
module.exports = router
