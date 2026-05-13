


const AdminUserChat = require("../models/AdminUserChat");

class AdminChatService {
static async sendMessage({ userId, senderId, senderRole, text }) {
  let chat = await AdminUserChat.findOne({ userId });


  const newMessage = {
    senderId,
    senderRole,
    text,

  isRead: senderRole === "admin",
    createdAt: new Date(),
  };

  if (!chat) {

    chat = new AdminUserChat({
      userId,
      messages: [newMessage],
      lastMessage: text,
    });
  } else {

    chat.messages.push(newMessage);
    chat.lastMessage = text;
  }

  await chat.save();

  return newMessage;
}


  static async getChat(userId, role) {
    const chat = await AdminUserChat.findOne({ userId }).lean();

    if (!chat) return { userId, messages: [] };

    const filteredMessages = chat.messages.filter((msg) => {
      if (role === "user") return !msg.deletedForUser;
      if (role === "admin") return !msg.deletedForAdmin;
      return true;
    });

    return {
      ...chat,
      messages: filteredMessages
    };
  }

  static async getAllChats() {
    return AdminUserChat.find()
      .sort({ updatedAt: -1 })
      .select("userId lastMessage updatedAt");
  }



}


module.exports = AdminChatService;
