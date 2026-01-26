

const express = require('express');
const checkUserStatus = require('../middlewares/checkUserStatus');
const { authenticateUser } = require('../middlewares/auth');
const { default: UserController } = require('../controllers/userController');
const AuthController = require('../controllers/authController');



const router = express.Router();


router.get('/me', checkUserStatus, authenticateUser, UserController.getProfile);
router.post('/add-address', checkUserStatus, authenticateUser, UserController.addAddress);
router.get('/get-address', checkUserStatus, authenticateUser, UserController.getAddresses);
router.get('/address/:addressId',checkUserStatus,authenticateUser,UserController.getAddressById)
router.put('/edit-address/:addressId',checkUserStatus,authenticateUser,UserController.updateAddress);
router.delete('/delete-address/:addressId',checkUserStatus,authenticateUser, UserController.deleteAddress)
module.exports = router
