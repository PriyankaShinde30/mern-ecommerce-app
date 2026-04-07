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