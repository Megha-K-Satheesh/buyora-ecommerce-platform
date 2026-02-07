const Admin = require('../models/admin/Admin');
const { generateAdminToken } = require('../utils/jwt');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');
const { adminLoginValidation, statusUpdateValidation } = require('../utils/validation');
const logger = require('../utils/logger');
const { notifyUserBanned, notifyUserUnbanned } = require('../utils/socket');
const BaseController = require('./BaseController');
const { AdminService } = require('../services');


class AdminController extends BaseController{
  
  static login = BaseController.asyncHandler(async (req,res)=>{
         
         const result =  await AdminService.login(req.body);
         BaseController.logAction("AdMIN LOGIN SUCCESS",req.body);
         BaseController.sendSuccess(res,"ADDMIN LOGIN SUCCESS",result)
  })
}
module.exports = AdminController 
