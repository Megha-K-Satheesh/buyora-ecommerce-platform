


const express = require("express");
const { authenticateAdmin } = require("../middlewares/auth");
const brandController = require("../controllers/brandController");

const router = express.Router()

router.post('/add-brand',authenticateAdmin,brandController.addBrand)
router.get('/get-brands/:categoryId',authenticateAdmin,brandController.getBrandsByCategoryId)

module.exports = router
