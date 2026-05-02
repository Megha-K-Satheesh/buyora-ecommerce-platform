const BrandService = require("../services/BrandService");
const { addBrandValidation } = require("../utils/adminValidation/brandValidation");
const BaseController = require("./BaseController");


class brandController extends BaseController{
   static addBrand = BaseController.asyncHandler(async(req,res)=>{
    const validatedData = BaseController.validateRequest(addBrandValidation,req.body)
       const result = await BrandService.addBrand(validatedData)
       
        BaseController.logAction("BRAND CREATED",result);
          BaseController.sendSuccess(res,"BRAND CREATED",result)
   });



   static getAllBrands = BaseController.asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;

  const result = await BrandService.getAllBrands({
    page,
    limit,
    search,
  });

  BaseController.logAction("BRANDS LISTED", result);
  BaseController.sendSuccess(res, "BRANDS FETCHED", result);
});

static updateBrand = BaseController.asyncHandler(async (req, res) => {
  const { brandId } = req.params;
console.log("brandid",brandId)
  const validatedData = req.body; 
console.log(validatedData)
  const result = await BrandService.updateBrand(brandId, validatedData);
  console.log(result)

  BaseController.logAction("BRAND UPDATED", result);
  BaseController.sendSuccess(res, "BRAND UPDATED", result);
});

static deleteBrand = BaseController.asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const result = await BrandService.deleteBrand(brandId);

  BaseController.logAction("BRAND DELETED", result);
  BaseController.sendSuccess(res, "BRAND DELETED", result);
});

static getBrandById = BaseController.asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  if (!brandId) {
    return BaseController.sendError(res, "Brand ID is required", 400);
  }

  const result = await BrandService.getBrandById(brandId);

  BaseController.logAction("BRAND FETCHED BY ID", result);
  BaseController.sendSuccess(res, "BRAND FETCHED", result);
});

   static getBrandsByCategoryId = BaseController.asyncHandler(async(req,res)=>{

      const {categoryId} =  req.params;
        const result = await BrandService.getBrandsByCategoryId(categoryId)
        BaseController.logAction("BRAND FETCHED",result);
          BaseController.sendSuccess(res,"BRAND FETCHED",result)
   })
}

module.exports= brandController

