const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware.js');
const { isAdmin } = require('../middleware/adminMiddlware.js');
const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', verifyToken, isAdmin, upload.array('images', 5), productController.addProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin,  productController.deleteProduct);

module.exports = router;