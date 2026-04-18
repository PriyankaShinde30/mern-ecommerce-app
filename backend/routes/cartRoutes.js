const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/:user_id', cartController.getCart);
router.patch('/update', cartController.updateCartQuantity);
router.delete('/remove/:cart_item_id', cartController.removeCartItem);

module.exports = router;