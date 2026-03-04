const UserCouponService = require("../../services/UserCouponService");
const BaseController = require("../BaseController");

class userCouponController extends BaseController{

  static verifyCoupon = BaseController.asyncHandler(async(req,res)=>{


   const userId = req.user?._id || null;
   console.log("user id form the contollrer",userId)
      const result = await UserCouponService.verifyCoupon({...req.body,userId})

       
    BaseController.logAction("COUPON VERIFYIED", result);
    BaseController.sendSuccess(res, "COUPON VERIFYIED", result);
  })

   static removeCoupon = BaseController.asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    const result = await UserCouponService.removeCoupon(userId);

    BaseController.logAction("COUPON REMOVED", result);
    BaseController.sendSuccess(res, "COUPON REMOVED", result);
  });

}

module.exports = userCouponController
