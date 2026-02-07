const express = require("express");
const upload = require("../middlewares/upload");
const ProductController = require("../controllers/productController");
const { authenticateAdmin } = require("../middlewares/auth");


const router = express.Router()


router.post('/add-product',authenticateAdmin,upload.array('images',5),ProductController.addProduct)
module.exports = router;
