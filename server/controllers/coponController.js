const CouponService = require("../services/CouponService");
const BaseController = require("./BaseController");

class CouponController extends BaseController{
    

  static addCoupon = BaseController.asyncHandler(async(req,res)=>{
           
       const result = await CouponService.addCoupon(req.body);
       BaseController.logAction("COUPON ADDED", result);
    BaseController.sendSuccess(res, "COUPON ADDED", result);
  })


  static getCouponsList = BaseController.asyncHandler(async (req, res) => {
 
    const { page = 1, limit = 10, search = "", status = "", category = "" } = req.query;

    const filters = {
      search,
      status,
      category,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await CouponService.getCouponList(filters);

    BaseController.logAction("ALL COUPONS FETCHED", result);
    BaseController.sendSuccess(res, "ALL COUPONS FETCHED", result);
  });

  // GET COUPON BY ID
  static getCouponById = BaseController.asyncHandler(async (req, res) => {
    const result = await CouponService.getCouponById(req.params.id);
    BaseController.logAction("COUPON FETCHED", result);
    BaseController.sendSuccess(res, "COUPON FETCHED", result);
  });

  // UPDATE COUPON
  static updateCoupon = BaseController.asyncHandler(async (req, res) => {
    const result = await CouponService.updateCoupon(req.params.id, req.body);
    BaseController.logAction("COUPON UPDATED", result);
    BaseController.sendSuccess(res, "COUPON UPDATED", result);
  });

  // DELETE COUPON
  static deleteCoupon = BaseController.asyncHandler(async (req, res) => {
    const result = await CouponService.deleteCoupon(req.params.id);
    BaseController.logAction("COUPON DELETED", result);
    BaseController.sendSuccess(res, "COUPON DELETED", result);
  });

}

module.exports = CouponController
