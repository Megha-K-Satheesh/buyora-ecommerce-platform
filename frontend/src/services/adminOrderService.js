import adminApiClient from "../utils/adminApiClient";

export const adminOrderService = {

  
  getAllOrders(params) {
    return adminApiClient.get("/order/get-all-orders", {
      params
    });
  },

 
  getSingleOrder(orderId) {
    return adminApiClient.get(`/order/${orderId}`);
  },


  approveReturn(orderId, productId,variantId) {
    return adminApiClient.patch("/order/approve-return", {
      orderId,
      productId,
      variantId
    });
  },

 
  rejectReturn(orderId, productId,variantId) {
    return adminApiClient.patch("/order/reject-return", {
      orderId,
      productId,
      variantId
    });
  },


  updateStatus(orderId, productId, status,variantId) {
    return adminApiClient.patch("/order/update-status", {
      orderId,
      productId,
      variantId,
      status,
    });
  }

};
