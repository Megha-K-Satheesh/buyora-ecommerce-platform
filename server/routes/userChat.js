const express = require("express");

const { authenticateUser } = require("../middlewares/auth");
const UserChatController = require("../controllers/user/userChatController");

const router = express.Router();



router.get("/history", authenticateUser, UserChatController.getHistory);



module.exports = router;
