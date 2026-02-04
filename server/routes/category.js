const express = require('express');
const { authenticateAdmin } = require('../middlewares/auth');
const CategoryController = require('../controllers/categoryController');
const checkUserStatus = require('../middlewares/checkUserStatus');

const router = express.Router()

router.post('/add-category',authenticateAdmin,CategoryController.addCategory)
router.get('/get-category',authenticateAdmin,CategoryController.getCategories)
router.get('/categories-table',authenticateAdmin,CategoryController.categoriesTable);
router.put('/update-category/:categoryId',authenticateAdmin,CategoryController.updateCategory)
router.delete('/delete-category/:categoryId',authenticateAdmin,CategoryController.deleteCategory)
module.exports= router
