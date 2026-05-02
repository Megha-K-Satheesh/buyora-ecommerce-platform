const express = require("express");
const router = express.Router();

const { authenticateAdmin } = require("../middlewares/auth");
const AdminChatController = require("../controllers/adminChatController");
const checkUserStatus = require("../middlewares/checkUserStatus");




router.get("/history/:userId", authenticateAdmin, AdminChatController.getChat);

router.get("/all-chats", authenticateAdmin, AdminChatController.getAllChats);



module.exports = router;
