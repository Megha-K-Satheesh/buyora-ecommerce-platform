const UserCouponService = require("../../services/UserCouponService");
const BaseController = require("../BaseController");

class userCouponController extends BaseController{

  

  static verifyCoupon = BaseController.asyncHandler(async (req, res) => {

  const userId = req.user?._id || null;

  const result = await UserCouponService.verifyCoupon({
    ...req.body,
    userId
  });

  await UserCouponService.applyCoupon(userId, result);

  BaseController.logAction("COUPON VERIFIED", result);
  BaseController.sendSuccess(res, "COUPON VERIFIED", result);
});

   static removeCoupon = BaseController.asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    const result = await UserCouponService.removeCoupon(userId);

    BaseController.logAction("COUPON REMOVED", result);
    BaseController.sendSuccess(res, "COUPON REMOVED", result);
  });

  static getCoupons = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const coupons = await UserCouponService.getAvailableCoupons(userId);

    BaseController.logAction("COUPONS FETCHED", { userId, count: coupons.length });
    BaseController.sendSuccess(res, "AVAILABLE COUPONS", coupons);
  });
static getCoupons = BaseController.asyncHandler(async (req, res) => {
  const userId = req.user?._id;

 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const coupons = await UserCouponService.getAvailableCoupons(userId, { page, limit });

  BaseController.logAction("COUPONS FETCHED", { userId, count: coupons.length });
  BaseController.sendSuccess(res, "AVAILABLE COUPONS", { coupons });
});

}

module.exports = userCouponController
