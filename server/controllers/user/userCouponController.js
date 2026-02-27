const UserCouponService = require("../../services/UserCouponService");
const BaseController = require("../BaseController");

class userCouponController extends BaseController{

  static verifyCoupon = BaseController.asyncHandler(async(req,res)=>{


   const userId = req.user?._id || null;
      const result = await UserCouponService.verifyCoupon(req.body,userId)

       
    BaseController.logAction("COUPON VERIFYIED", result);
    BaseController.sendSuccess(res, "COUPON VERIFYIED", result);
  })

}

module.exports = userCouponController
