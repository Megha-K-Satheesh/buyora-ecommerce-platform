
const AdminChatService = require("../../services/AdminUserChatService");
const BaseController = require("../BaseController");


class UserChatController {


  static getHistory = BaseController.asyncHandler(async (req, res) => {
    const chat = await AdminChatService.getChat(req.user._id);

    BaseController.sendSuccess(res, "Chat history", chat);
  });

 
}

module.exports = UserChatController;
