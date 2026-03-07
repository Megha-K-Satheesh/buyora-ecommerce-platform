const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const WalletController = require("../controllers/user/userWalletController");


const router = express.Router();


router.get("/wallet-balance", authenticateUser, WalletController.getWallet);

module.exports = router;
