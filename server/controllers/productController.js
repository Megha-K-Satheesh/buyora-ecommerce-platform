const ProductService = require("../services/ProductService");
const BaseController = require("./BaseController");



class ProductController extends BaseController{
    static addProduct = BaseController.asyncHandler(async(req,res)=>{
        const result = await ProductService.addProduct({body:req.body,files:req.files})
         BaseController.logAction("PRODUCT ADDED",result);
          BaseController.sendSuccess(res,"PRODUCT ADDED",result)
    })
}
module.exports = ProductController
