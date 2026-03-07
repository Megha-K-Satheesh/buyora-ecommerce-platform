const BaseController = require("../BaseController");
const WalletService = require("../../services/WalletService");

class WalletController extends BaseController {

  static getWallet = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    console.log(limit)

    const wallet = await WalletService.getWallet(userId, { page, limit });

    BaseController.logAction("WALLET DETAILS FETCHED", wallet);
    BaseController.sendSuccess(res, "WALLET DETAILS FETCHED", wallet);
  });

}

module.exports = WalletController;
