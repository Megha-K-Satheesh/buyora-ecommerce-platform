const BrandService = require("../services/BrandService");
const BaseController = require("./BaseController");


class brandController extends BaseController{
   static addBrand = BaseController.asyncHandler(async(req,res)=>{
       const result = await BrandService.addBrand(req.body)
       
        BaseController.logAction("BRAND CREATED",result);
          BaseController.sendSuccess(res,"BRAND CREATED",result)
   });

   static getBrandsByCategoryId = BaseController.asyncHandler(async(req,res)=>{

      const {categoryId} =  req.params;
        const result = await BrandService.getBrandsByCategoryId(categoryId)
        BaseController.logAction("BRAND FETCHED",result);
          BaseController.sendSuccess(res,"BRAND FETCHED",result)
   })
}

module.exports= brandController

