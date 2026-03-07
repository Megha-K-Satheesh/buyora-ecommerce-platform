const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const { ErrorFactory } = require("../utils/errors");

class WalletService {

  static async getWallet(userId, { page = 1, limit = 10 } = {}) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw ErrorFactory.validation("Invalid user ID");
    }

    const skip = (page - 1) * limit;

    let wallet = await Wallet.findOne({ userId })
      .populate("transactions.orderId", "orderNumber totalAmount")
      .lean();

    if (!wallet) {
      wallet = {
        balance: 0,
        transactions: []
      };
    }

   
    const sortedTx = wallet.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   
    const paginatedTx = sortedTx.slice(skip, skip + limit);

    return {
      balance: wallet.balance,
      totalTransactions: wallet.transactions.length,
      page,
      limit,
      transactions: paginatedTx.map(tx => ({
        type: tx.type,
        amount: tx.amount,
        reason: tx.reason,
        orderId: tx.orderId?._id || null,
        orderNumber: tx.orderId?.orderNumber || null,
        createdAt: tx.createdAt
      }))
    };
  }

}

module.exports = WalletService;
