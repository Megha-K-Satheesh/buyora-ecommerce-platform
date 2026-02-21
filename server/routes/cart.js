const express = require('express');
const { authenticateUser } = require('../middlewares/auth');
const CartController = require('../controllers/user/userCartController');

const router = express.Router()



router.post('/add-to-cart', authenticateUser, CartController.addToCart);


router.post('/merge-cart', authenticateUser, CartController.mergeCart);


router.get('/', authenticateUser, CartController.getCart);

router.put('/update/:variationId', authenticateUser, CartController.updateCartQuantity);


router.delete('/remove/:variationId', authenticateUser, CartController.removeFromCart);

module.exports = router;
