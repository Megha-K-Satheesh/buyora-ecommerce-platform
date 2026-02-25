import adminApiClient from "../utils/adminApiClient";


export const couponService = {
  addCoupon (data)  {
    return adminApiClient.post("/coupon/add-coupon", data);
  },

  getCouponsList({ page = 1, limit = 10, search = "", status = "", category = "" } = {}) {
    return adminApiClient.get("/coupon/get-coupons", {
      params: { page, limit, search, status, category },
    });
  },
}
