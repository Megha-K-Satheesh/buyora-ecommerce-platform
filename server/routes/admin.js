const express = require('express');

const AdminController = require('../controllers/adminController');
const checkUserStatus = require('../middlewares/checkUserStatus');

const router = express.Router();

router.post('/login', AdminController.login);


module.exports = router;
