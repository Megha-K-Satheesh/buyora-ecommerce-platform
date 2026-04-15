

const AdminUserListService = require("../services/AdminUserListService");
const BaseController = require("./BaseController");

class adminUserController extends BaseController {

 
  static getUsersList = BaseController.asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status = "", search = "" } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      search,
    };

    const result = await AdminUserListService.getUsers(filters);
    BaseController.logAction("ALL USERS FETCHED", result);
    BaseController.sendSuccess(res, "ALL USERS FETCHED", result);
  });


  static getUserById = BaseController.asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const result = await AdminUserListService.findUser({ userId });
    BaseController.logAction("USER FETCHED", result);
    BaseController.sendSuccess(res, "USER FETCHED", result);
  });

 
  static banUser = BaseController.asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const adminId = req.user?._id; 
    const { reason } = req.body;

    const result = await AdminUserListService.banUser(userId, adminId, reason);
    BaseController.logAction("USER BANNED", result);
    BaseController.sendSuccess(res, "USER BANNED", result);
  });

  
  static unbanUser = BaseController.asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const result = await AdminUserListService.unbanUser(userId);
    BaseController.logAction("USER UNBANNED", result);
    BaseController.sendSuccess(res, "USER UNBANNED", result);
  });
}

module.exports = adminUserController;
