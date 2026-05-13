


const AdminChatService = require("../services/AdminUserChatService");
const { ErrorFactory } = require("../utils/errors");
const BaseController = require("./BaseController");

class AdminChatController {


  static getChat = BaseController.asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const chat = await AdminChatService.getChat(userId);

    BaseController.sendSuccess(res, "Chat fetched", chat);
  });

  static getAllChats = BaseController.asyncHandler(async (req, res) => {
    const chats = await AdminChatService.getAllChats();

    BaseController.sendSuccess(res, "All chats fetched", chats);
  });

  static getUnreadMessagesCount = BaseController.asyncHandler(
  async (req, res) => {

    const count =
      await AdminChatService.getUnreadMessagesCount();

    BaseController.sendSuccess(
      res,
      "Unread messages count fetched",
      count
    );
  }
);
}

module.exports = AdminChatController;
