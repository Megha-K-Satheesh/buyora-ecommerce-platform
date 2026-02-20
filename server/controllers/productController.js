const ProductService = require("../services/ProductService");
const BaseController = require("./BaseController");



class ProductController extends BaseController{
    static addProduct = BaseController.asyncHandler(async(req,res)=>{
        const result = await ProductService.addProduct({body:req.body,files:req.files})
         BaseController.logAction("PRODUCT ADDED",result);
          BaseController.sendSuccess(res,"PRODUCT ADDED",result)
    })

    static getProductsList = BaseController.asyncHandler(async (req, res) => {
  const { page, limit, category, status, search = "", priceSort } = req.query;

  const result = await ProductService.getProductsList({
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

 static getProducts = BaseController.asyncHandler(async(req,res)=>{

      const {
    category,
    brand,
    minPrice,
    maxPrice,
    size,
    color,
    discount,
    search,
    page,
    limit,
    sort,
  } = req.query;

    const result = await ProductService.getProducts({ category,
    brand,
    minPrice,
    maxPrice,
    size,
    color,
    discount,
    search,
    page,
    limit,
    sort})
      BaseController.logAction("PRODUCTS FETCHED PLP", result);
  BaseController.sendSuccess(res, "PRODUCTS FETCHED", result);

 })


  //  static getSidebarFilters = BaseController.asyncHandler(async (req, res) => {

  //   const { category } = req.query;

  //   const result = await ProductService.getSidebarFilters(category);

  //   BaseController.logAction("SIDEBAR FILTERS FETCHED", result);
  //   BaseController.sendSuccess(res, "SIDEBAR FILTERS FETCHED", result);

  // });


  static updateProduct = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await ProductService.updateProduct({
      id,
      body: req.body,
      files: req.files,
    });

    BaseController.logAction("PRODUCT UPDATED", result);
    BaseController.sendSuccess(res, "PRODUCT UPDATED", result);
  });

  static deleteProduct = BaseController.asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await ProductService.deleteProduct(id);

  BaseController.logAction("PRODUCT DELETED", result);
  BaseController.sendSuccess(res, "PRODUCT DELETED", result);
});


}
module.exports = ProductController
