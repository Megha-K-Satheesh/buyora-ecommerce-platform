const { level } = require("winston");
const UserProductService = require("../../services/general/UserProductsService");
const BaseController = require("../BaseController");





class UserProductController extends BaseController{
   

 static getProducts = BaseController.asyncHandler(async(req,res)=>{

      const {
       page,
      limit,
      brand,
      color,
      size,
      sort,
     level1,
     level2,level3
  } = req.query;

    const filters = {
  page: Number(page) || 1,
  limit: Number(limit) || 12,
  brand: brand || [],
  color: color || [],
  size: size || [],
  sort: sort || "",
  level1:level1 || null,
  level2:level2 || null,
  level3:level3 || null,

};

    const result = await UserProductService.getProducts(filters)
      BaseController.logAction("PRODUCTS FETCHED PLP", result);
  BaseController.sendSuccess(res, "PRODUCTS FETCHED", result);

 })


   static getSidebarFilters = BaseController.asyncHandler(async (req, res) => {
    console.log("queryyyyyyyyyyy",req.query)
    const { level1, level2 } = req.query;
    console.log("form controller ",level1,level2)

    const result = await UserProductService.getSidebarFilters(level1,level2);

    BaseController.logAction("SIDEBAR FILTERS FETCHED", result);
    BaseController.sendSuccess(res, "SIDEBAR FILTERS FETCHED", result);

  });
  

  static getProductById = BaseController.asyncHandler(async(req,res)=>{
        const {id} = req.params;

        const result = await UserProductService.getProductById(id)
         BaseController.logAction("SINGEL PRODUCT FETCHED", result);
        BaseController.sendSuccess(res, "SINGEL PRODUCT FETCHED", result);
  })
}
module.exports = UserProductController
