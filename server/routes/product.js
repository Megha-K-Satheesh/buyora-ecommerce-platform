const express = require("express");
const upload = require("../middlewares/upload");
const ProductController = require("../controllers/productController");
const { authenticateAdmin } = require("../middlewares/auth");


const router = express.Router()


router.post('/add-product',authenticateAdmin,upload.array('images',5),ProductController.addProduct)
router.get('/get-products-list',authenticateAdmin,ProductController.getProductsList)


router.put(
  '/update-product/:id',
  authenticateAdmin,
  upload.array('images', 5),
  ProductController.updateProduct
)
router.delete("/delete-product/:id",authenticateAdmin, ProductController.deleteProduct);

// router.get('/get-products',ProductController.getProducts)
// router.get('get-sidebar-filter',ProductController.getSidebarFilters)
module.exports = router;
