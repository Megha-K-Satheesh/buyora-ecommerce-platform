const express = require("express");
const adminUserController = require("../controllers/adminUserController");
const { authenticateAdmin } = require("../middlewares/auth");

const router = express.Router();


router.get("/", authenticateAdmin,adminUserController.getUsersList);


router.get("/:id",authenticateAdmin, adminUserController.getUserById);


router.post("/:id/ban",authenticateAdmin, adminUserController.banUser);


router.post("/:id/unban",authenticateAdmin,adminUserController.unbanUser);

module.exports = router;
