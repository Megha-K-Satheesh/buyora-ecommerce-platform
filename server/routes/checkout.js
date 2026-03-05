

const express = require('express');
const CheckoutController = require('../controllers/user/userCheckoutController');
const { authenticateUser } = require('../middlewares/auth');

const routers = express.Router();

routers.get('/get-order-summery',authenticateUser,CheckoutController.getOrderSummary)

routers.post(
  "/place-order",
  authenticateUser,
  CheckoutController.placeOrder
);

routers.post(
  "/verify-payment",
  authenticateUser,
  CheckoutController.verifyPayment
);
// routers.get("/get-all-orders", CheckoutController.getAllOrders);
// routers.get("/get-single-order/:orderId", CheckoutController.getSingleOrder);



module.exports=routers
