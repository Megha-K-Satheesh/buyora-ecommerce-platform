const CouponService = require("../services/CouponService");
const { couponValidation, updateCouponValidation } = require("../utils/adminValidation/couponValidation");
const BaseController = require("./BaseController");

class CouponController extends BaseController{
    

  static addCoupon = BaseController.asyncHandler(async(req,res)=>{

   let discount = req.body.discount;

  
  if (typeof discount === "string") {
    discount = JSON.parse(discount);
  }

  
  discount = {
    ...discount,
    value: Number(discount.value),
    maxDiscount: Number(discount.maxDiscount)
  };

  const dataToValidate = {
    ...req.body,
    discount
  };
    const validatedData = BaseController.validateRequest(couponValidation,dataToValidate)
           
       const result = await CouponService.addCoupon(validatedData);
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


  static getCouponById = BaseController.asyncHandler(async (req, res) => {
    const result = await CouponService.getCouponById(req.params.id);
    BaseController.logAction("COUPON FETCHED", result);
    BaseController.sendSuccess(res, "COUPON FETCHED", result);
  });

  

static updateCoupon = BaseController.asyncHandler(async (req, res) => {

  let discount = req.body.discount;

  if (typeof discount === "string") {
    discount = JSON.parse(discount);
  }

  if (discount) {
    discount = {
      ...discount,
      value: Number(discount.value),
      maxDiscount: Number(discount.maxDiscount)
    };
  }

  const dataToValidate = {
    ...req.body,
    discount
  };

  const validatedData = BaseController.validateRequest(
updateCouponValidation,
    dataToValidate
  );

  const result = await CouponService.updateCoupon(
    req.params.id,
    validatedData
  );

  BaseController.logAction("COUPON UPDATED", result);
  BaseController.sendSuccess(res, "COUPON UPDATED", result);
});

  static deleteCoupon = BaseController.asyncHandler(async (req, res) => {
    const result = await CouponService.deleteCoupon(req.params.id);
    BaseController.logAction("COUPON DELETED", result);
    BaseController.sendSuccess(res, "COUPON DELETED", result);
  });

}

module.exports = CouponController
