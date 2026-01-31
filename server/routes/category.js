const express = require('express');
const { authenticateAdmin } = require('../middlewares/auth');
const CategoryController = require('../controllers/categoryController');

const router = express.Router()

router.post('/add-category',authenticateAdmin,CategoryController.addCategory)
module.exports= router
