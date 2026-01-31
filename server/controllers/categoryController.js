const CategoryService = require("../services/CategoryService");
const BaseController = require("./BaseController");



class CategoryController extends BaseController {
     static addCategory = BaseController.asyncHandler(async(req,res)=>{

            const result = await CategoryService.addCategory(req.body)

            BaseController.logAction("CATEGORY ADDED",result);
            BaseController.sendSuccess(res,"CATEGORY ADDED",result);
     })
}
module.exports=CategoryController
