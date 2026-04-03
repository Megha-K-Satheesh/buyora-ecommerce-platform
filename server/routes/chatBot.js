const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/auth");
const ChatbotController = require("../controllers/user/chatBotController");


router.post("/send-message", authenticateUser, ChatbotController.sendMessage);

router.get("/history",authenticateUser, ChatbotController.getHistory);
router.delete("/clear",authenticateUser, ChatbotController.clearChat);
module.exports = router;
