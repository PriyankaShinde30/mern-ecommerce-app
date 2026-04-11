const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');
const { verifyToken } = require('../middleware/authMiddleware.js');

router.post('/checkout', orderController.checkout);
router.get('/history', verifyToken, orderController.getOrderHistory);

module.exports = router;