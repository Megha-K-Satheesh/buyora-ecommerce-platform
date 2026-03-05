
import apiClient from "../utils/apiClient";

export const orderService = {


  getAllOrders() {
    return apiClient.get("/user/order/get-all-orders"); 
  },

  getSingleOrder(orderId) {
    return apiClient.get(`/user/order/get-single-order/${orderId}`); 
  },

 cancelOrderItem(orderId, productId, reason = "") {
    return apiClient.put(`/user/order/cancel-item`, {
      orderId,
      productId,
      reason
    });
  },

 
  requestReturnItem(orderId, productId, reason = "") {
    return apiClient.put(`/user/order/request-return`, {
      orderId,
      productId,
      reason
    });
  },



};

