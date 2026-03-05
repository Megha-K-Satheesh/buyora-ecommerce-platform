


const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },

  balance: {
    type: Number,
    default: 0
  },

  transactions: [
    {
      type: {
        type: String,
        enum: ["CREDIT", "DEBIT"]
      },
      amount: Number,
      reason: String,
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
