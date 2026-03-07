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


  // Get coupon by ID
  getCouponById(id) {
    return adminApiClient.get(`/coupon/get-coupon/${id}`);
  },

  // Update coupon by ID
  updateCoupon(couponId, data) {
    return adminApiClient.put(`/coupon/update-coupon/${couponId}`, data);
  },

  // Delete coupon by ID
  deleteCoupon(couponId) {
    return adminApiClient.delete(`/coupon/delete-coupon/${couponId}`);
  },

  getAllCoupons({ page = 1, limit = 10 } = {}) {
    return apiClient.get("/user/coupon/get-all-coupons", {
      params: { page, limit},
    })
  },
  
}
