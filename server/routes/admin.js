const express = require('express');
// const {
//   adminLogin,
//   getAllUsers,
//   getUserById,
//   updateUserStatus,
//   banUser,
//   unbanUser,
//   forceLogoutUser,
//   updateUser,
//   deleteUser,
//   getDashboardStats
// } = require('../controllers/adminController');
// const { authenticateAdmin } = require('../middlewares/auth');
const AdminController = require('../controllers/adminController');
const checkUserStatus = require('../middlewares/checkUserStatus');

const router = express.Router();

router.post('/login', AdminController.login);


module.exports = router;
