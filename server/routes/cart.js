// const express = require('express');
// const { authenticateUser } = require('../middlewares/auth');
// const CartController = require('../controllers/user/userCartController');

// const router = express.Router()



// router.post('/add-to-cart', authenticateUser, CartController.addToCart);


// router.post('/merge-cart', authenticateUser, CartController.mergeCart);


// router.get('/', authenticateUser, CartController.getCart);

// router.put('/update/:variationId', authenticateUser, CartController.updateCartQuantity);


// router.delete('/remove/:variationId', authenticateUser, CartController.removeFromCart);

// module.exports = router;
const express = require('express');
const { authenticateUser } = require('../middlewares/auth');
const checkUserStatus = require('../middlewares/checkUserStatus');
const CartController = require('../controllers/user/userCartController');

const router = express.Router();

router.post('/add-to-cart', checkUserStatus,authenticateUser, CartController.addToCart);

router.post('/merge-cart',  checkUserStatus,authenticateUser, CartController.mergeCart);

router.get('/', checkUserStatus,authenticateUser,CartController.getCart);

router.put('/update/:variationId', checkUserStatus,authenticateUser, CartController.updateCartQuantity);

router.delete('/remove/:variationId', checkUserStatus,authenticateUser,CartController.removeFromCart);

module.exports = router;
