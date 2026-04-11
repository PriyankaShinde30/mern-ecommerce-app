const productModel = require('../models/productModel');
const db = require('../config/db');

exports.getProducts = async (req, res) => {
    try {
        // const [products] = await productModel.getAllProducts();

        // res.status(200).json({message: 'Products fetched successfully', count: products.length, products});

        const { 
            search, 
            category, 
            minPrice, 
            maxPrice,
            sort, 
            page,
            limit
        } = req.query;

        let offset;

        if(page && limit) {
            const pageNumber = parseInt(page);
            const limitNumber = parseInt(limit);

            offset = (pageNumber - 1) * limitNumber;
        }

        const filters = {
            search, 
            category, 
            minPrice,
            maxPrice, 
            sort,
            limit: limit ? parseInt(limit) : null, 
            offset: offset !== undefined ? offset : null
        };

        const [products] = await productModel.getFilteredProducts(filters);

        res.status(200).json({
            message: 'Products fetched successfully',
            count: products.length,
            products
        });
    } catch (err) {
        res.status(500).json({message: "Server error", err: err});
    }
};

exports.getProductById = async (req, res) => {
    try{
        const { id } = req.params;
    
        const [products] = await productModel.getProductById(id);

    if(products.length === 0) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    res.status(200).json({
        message: 'Product fetched successfully',
        products: products[0]
    });
    } catch(err) {
        res.status(500).json({
            message: 'Server erro',
            err
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            brand, 
            price, 
            category_id, 
            sub_category_id
        } = req.body;

        // 1️⃣ Insert product
        const [result] = await db.execute(
            `INSERT INTO products 
            (name, description, brand, price, category_id, sub_category_id) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, brand, price, category_id, sub_category_id]
        );

        const productId = result.insertId;

        // 2️⃣ Insert images
        if (req.files && req.files.length > 0) {
            const imageQueries = req.files.map(file => {
                return db.execute(
                    `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
                    [productId, file.path]
                );
            });

            await Promise.all(imageQueries);
        }

        res.status(201).json({
            message: 'Product added with images'
        });
    } catch(err) {
        res.status(500).json({
            message: 'Server error',
            err: err.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try { 
        const { id } = req.params;

        const {
            name, 
            description, 
            price
        } = req.body;

        const query = `UPDATE products SET name = ?, description = ?, price = ? WHERE product_id = ?`;

        await db.execute(query, [name, description, price, id]);

        res.json({
            message: 'Product updated'
        });
    }catch (err) {
        res.status(500).json({
            message: 'Server error', 
            err: err.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `UPDATE products SET deleted_at = NOW() WHERE product_id = ?`;

        await db.execute(query, [id]);

        res.json({
            message: 'Product deleted'
        });
    }catch (err) {
        res.status(500).json({
            message: 'Server error', 
            err: err.message
        });
    }
};