

const express = require("express");


const UserProductController = require("../../controllers/user/userProductController");



const router = express.Router()


router.get('/get-products',UserProductController.getProducts)
router.get('/get-sidebar-filter',UserProductController.getSidebarFilters)
router.get('/get-product-by-id/:id',UserProductController.getProductById)
module.exports = router;
