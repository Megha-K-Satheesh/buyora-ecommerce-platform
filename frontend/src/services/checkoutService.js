
import apiClient from "../utils/apiClient";

export const checkoutService = {

 
  getOrderSummary() {
    return apiClient.get("/user/checkout/get-order-summery");
  },


  placeOrder(data) {
    return apiClient.post("/user/checkout/place-order", data);
  },


  verifyPayment(data) {
    return apiClient.post("/user/checkout/verify-payment", data);
  },



};
