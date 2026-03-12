import adminApiClient from "../utils/adminApiClient";

export const adminOrderService = {

  // GET ALL ORDERS (pagination + search)
  getAllOrders(params) {
    return adminApiClient.get("/order/get-all-orders", {
      params
    });
  },

  // GET SINGLE ORDER
  getSingleOrder(orderId) {
    return adminApiClient.get(`/order/${orderId}`);
  },

  // APPROVE RETURN
  approveReturn(orderId, productId,variantId) {
    return adminApiClient.patch("/order/approve-return", {
      orderId,
      productId,
      variantId
    });
  },

  // REJECT RETURN
  rejectReturn(orderId, productId,variantId) {
    return adminApiClient.patch("/order/reject-return", {
      orderId,
      productId,
      variantId
    });
  },

  // UPDATE ITEM STATUS (SHIPPED / DELIVERED etc)
  updateStatus(orderId, productId, status,variantId) {
    return adminApiClient.patch("/order/update-status", {
      orderId,
      productId,
      variantId,
      status,
    });
  }

};
