const express = require("express");
const AdminOrderController = require("../controllers/adminOrderController");
const { authenticateAdmin } = require("../middlewares/auth");
const router = express.Router();


router.get("/get-all-orders",authenticateAdmin, AdminOrderController.getAllOrders);

router.get("/:orderId",authenticateAdmin, AdminOrderController.getSingleOrder);

router.patch("/approve-return",authenticateAdmin, AdminOrderController.approveReturn);
router.patch("/update-status", authenticateAdmin,AdminOrderController.updateOrderItemStatus);
router.patch("/reject-return", authenticateAdmin,AdminOrderController.rejectReturn);

module.exports = router;
