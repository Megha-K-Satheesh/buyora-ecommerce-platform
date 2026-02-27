import adminApiClient from "../utils/adminApiClient";
import apiClient from "../utils/apiClient";


export const couponService = {
  addCoupon (data)  {
    return adminApiClient.post("/coupon/add-coupon", data);
  },

  getCouponsList({ page = 1, limit = 10, search = "", status = "", category = "" } = {}) {
    return adminApiClient.get("/coupon/get-coupons", {
      params: { page, limit, search, status, category },
    })
  },
  verifyCoupon(data) {
    return apiClient.post("/user/coupon/verify-coupon", data);
  }
}
