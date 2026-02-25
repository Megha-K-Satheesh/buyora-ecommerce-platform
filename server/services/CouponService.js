const Coupon = require("../models/admin/Coupon")
const { ErrorFactory } = require("../utils/errors");



class CouponService {
  static async addCoupon(data) {
     const existing = await Coupon.findOne({code:data.code})
     if(existing) {
      throw ErrorFactory.conflict("This Coupon Already Exist")
     }

     const coupon = await Coupon.create(data)
     return coupon
  } 


    static async getCouponList({ page = 1, limit = 10, search = "", status = "", category = "" }) {
    const filter = {};

    // Filter by status
    if (status) filter.isActive = status === "active";

    // Filter by category (CATEGORY scoped coupons)
    if (category) filter.applicableCategories = category;

    // Search by coupon code or description
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, coupons] = await Promise.all([
      Coupon.countDocuments(filter),
      Coupon.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      coupons,
      total,
      page,
      totalPages,
    };
  }


     static async getCouponById(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) throw ErrorFactory.notFound("Coupon not found");
    return coupon;
  }
  
  static async updateCoupon(id, data) {
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw ErrorFactory.notFound("Coupon not found");
    return coupon;
  }
    static async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw ErrorFactory.notFound("Coupon not found");
    return coupon;
  }
}


module.exports = CouponService
