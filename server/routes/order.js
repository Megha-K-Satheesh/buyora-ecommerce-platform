

const express = require('express');

const { authenticateUser } = require('../middlewares/auth');
const OrderController = require('../controllers/user/userOrderController');

const routers = express.Router();


routers.get("/get-all-orders",authenticateUser, OrderController.getAllOrders);
routers.get("/get-single-order/:orderId",authenticateUser, OrderController.getSingleOrder);
routers.put("/cancel-item", authenticateUser, OrderController.cancelOrderItem);
routers.put("/request-return", authenticateUser, OrderController.requestReturnItem);



module.exports=routers
