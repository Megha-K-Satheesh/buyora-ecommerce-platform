


const express = require("express");
const { authenticateAdmin } = require("../middlewares/auth");
const brandController = require("../controllers/brandController");

const router = express.Router()

router.post('/add-brand',authenticateAdmin,brandController.addBrand)
router.get('/get-brands/:categoryId',authenticateAdmin,brandController.getBrandsByCategoryId)


router.get("/brands", authenticateAdmin, brandController.getAllBrands);

router.get("/brands/:brandId", authenticateAdmin, brandController.getBrandById);


router.put("/brands/update-brand/:brandId", authenticateAdmin, brandController.updateBrand);

router.delete("/brands/delete-brand/:brandId", authenticateAdmin, brandController.deleteBrand);

module.exports = router
