const ChatService = require("../../services/ChatBotService");
const BaseController = require("../BaseController");

class ChatbotController extends BaseController {


  static sendMessage = BaseController.asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
      return BaseController.sendError(res, "Message is required");
    }

    const reply = await ChatService.processMessage(req.user._id, message);

    BaseController.sendSuccess(res, "Chat response", {
      message,
      reply
    });
  });

  
  static getHistory = BaseController.asyncHandler(async (req, res) => {
    const data = await ChatService.getChatHistory(req.user._id);

    BaseController.sendSuccess(res, "Chat history fetched", data);
  });

  static clearChat = BaseController.asyncHandler(async (req, res) => {
    const msg = await ChatService.clearChat(req.user._id);

    BaseController.sendSuccess(res, msg);
  });
}

module.exports = ChatbotController;
