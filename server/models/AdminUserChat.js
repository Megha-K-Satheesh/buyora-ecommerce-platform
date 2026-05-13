
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderRole: {
    type: String,
    enum: ["user", "admin"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
 isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },



});

const adminUserChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    messages: [messageSchema],

    lastMessage: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUserChat", adminUserChatSchema);
