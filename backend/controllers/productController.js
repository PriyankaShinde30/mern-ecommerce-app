const productModel = require('../models/productModel');

exports.getProducts = async (req, res) => {
    try {
        const [products] = await productModel.getAllProducts();

        res.status(200).json({message: 'Products fetched successfully', count: products.count, products});
    } catch (err) {
        res.status(500).json({message: "Server error"});
    }
};