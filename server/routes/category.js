const express = require('express');
const { authenticateAdmin } = require('../middlewares/auth');
const CategoryController = require('../controllers/categoryController');
const checkUserStatus = require('../middlewares/checkUserStatus');

const router = express.Router()

router.post('/add-category',authenticateAdmin,CategoryController.addCategory)
router.get('/get-category',CategoryController.getCategories)
router.get('/categories-table',authenticateAdmin,CategoryController.categoriesTable);
router.put('/update-category/:categoryId',authenticateAdmin,CategoryController.updateCategory)
router.delete('/delete-category/:categoryId',authenticateAdmin,CategoryController.deleteCategory)
router.get('/get-category-by-id/:categoryId',authenticateAdmin,CategoryController.getCategoryById)
router.get('category-attributes/:categoryId',authenticateAdmin,)
module.exports= router
