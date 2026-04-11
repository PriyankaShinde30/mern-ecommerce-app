const db = require('../config/db');

exports.getAllProducts = async () => {
    const query = `
    SELECT 
    p.product_id, 
    p.name, 
    p.description, 
    p.brand, 
    p.price, 
    p.discount_price, 
    p.sku, 
    c.description AS category, 
    sc.name AS sub_category 
    FROM products p JOIN categories c ON p.category_id = c.category_id 
    JOIN sub_categories sc ON p.sub_category_id = sc.sub_category_id`;

    return db.execute(query);
};

exports.getProductById = async (id) => {
    const query = `
    SELECT 
    p.product_id,
    p.name,
    p.description,
    p.brand,
    p.price,
    p.discount_price,
    p.sku,
    c.description AS category,
    sc.name AS sub_category
    FROM products p 
    JOIN categories c ON p.category_id = c.category_id
    JOIN sub_categories sc ON p.sub_category_id = sc.sub_category_id
    WHERE p.product_id = ?
    `;

    return db.execute(query, [id]);
};

exports.getFilteredProducts = async (filters) => {
    let query = `
    SELECT 
    p.product_id, 
    p.name,
    p.price, 
    p.discount_price,
    p.brand, 
    c.description AS category 
    FROM products p 
    JOIN categories c ON p.category_id = c.category_id
    WHERE 1 = 1
    `;

    const values = [];

    if(filters.search) {
        query += ` AND p.name LIKE ?`;
        values.push(`%${filters.search}%`);
    }

    if(filters.category) {
        query += ` AND p.category_id = ?`;
        values.push(filters.category);
    }

    if(filters.minPrice) {
        query += ` AND p.price >= ?`;
        values.push(filters.minPrice);
    }

    if(filters.maxPrice) {
        query += ` AND p.price <= ?`;
        values.push(filters.maxPrice);
    }

    if(filters.sort === 'price_asc') {
        query += ` ORDER BY p.price ASC`;
    }

    if(filters.sort === 'price_desc') {
        query += ` ORDER BY p.price DESC`;
    }

    if(filters.limit && filters.offset !== null) {
        query += ` LIMIT ${filters.limit} OFFSET ${filters.offset}`;
    }

    console.log("Query:",query);
    console.log("Values:", values);

    return db.execute(query, values);
};