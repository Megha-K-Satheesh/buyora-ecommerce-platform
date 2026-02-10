const ProductService = require("../services/ProductService");
const BaseController = require("./BaseController");



class ProductController extends BaseController{
    static addProduct = BaseController.asyncHandler(async(req,res)=>{
        const result = await ProductService.addProduct({body:req.body,files:req.files})
         BaseController.logAction("PRODUCT ADDED",result);
          BaseController.sendSuccess(res,"PRODUCT ADDED",result)
    })

    static getProducts = BaseController.asyncHandler(async (req, res) => {
  const { page, limit, category, status, search = "", priceSort } = req.query;

  const result = await ProductService.getProducts({
    page,
    limit,
    category,
    status,
    search,
    priceSort,
  });

  BaseController.logAction("PRODUCTS FETCHED TABLE", result);
  BaseController.sendSuccess(res, "PRODUCTS FETCHED TABLE", result);
});

}
module.exports = ProductController
