const CategoryService = require("../services/CategoryService");
const BaseController = require("./BaseController");



class CategoryController extends BaseController {
     static addCategory = BaseController.asyncHandler(async(req,res)=>{

            const result = await CategoryService.addCategory(req.body)

            BaseController.logAction("CATEGORY ADDED",result);
            BaseController.sendSuccess(res,"CATEGORY ADDED",result);
     });
     
     static getCategories = BaseController.asyncHandler(async(req,res)=>{
          const result = await CategoryService.getCategories();
          BaseController.logAction("CATEGORY FETCHED",result);
          BaseController.sendSuccess(res,"CATEGORY FETCHED",result)
     })
     static categoriesTable = BaseController.asyncHandler(async(req,res)=>{
            const {page,limit,level,status,search=""} = req.query

          const result = await CategoryService.categories(page,limit,level,status,search);
           BaseController.logAction("CATEGORY FETCHED TABLE",result);
          BaseController.sendSuccess(res,"CATEGORY FETCHED TABLE",result)
     })

     static updateCategory = BaseController.asyncHandler(async(req,res)=>{
          const {categoryId} = req.params;
          const result = await CategoryService.updateCategory(categoryId,req.body);
          BaseController.logAction("CATEGORY UPDATED");
          BaseController.sendSuccess(res,"CATEGORY UPDATED",result)
     })
     static deleteCategory = BaseController.asyncHandler(async(req,res)=>{
           const {categoryId} = req.params;
           const result = await CategoryService.deleteCategory(categoryId);
           BaseController.logAction("CATEGORY DELETED");
          BaseController.sendSuccess(res,"CATEGORY DELETED",result)
     })
   static getCategoryById = BaseController.asyncHandler(async(req,res)=>{
       const {categoryId} = req.params;
        const result = await CategoryService.getCategoryById(categoryId)
         BaseController.logAction("CATEGORY FETCHED",result);
          BaseController.sendSuccess(res,"CATEGORY FETCHED",result)
   })
}
module.exports=CategoryController
