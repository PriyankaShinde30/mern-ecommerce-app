const db = require('../config/db');

exports.createOrder = async (user_id, total) => {
    return db.execute(
        `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
        [user_id, total]
    );
};

exports.createOrderItem = async (order_id, product_id, quantity) => {
    return db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
        [order_id, product_id, quantity]
    );
};

exports.clearCart = async (cart_id) => {
    return db.execute(
        `DELETE FROM cart_items WHERE cart_id = ?`, 
        [cart_id]
    );
};

exports.getOrderHistory = async (user_id) => {
    const query = `
    SELECT 
    o.order_id,
    o.total, 
    o.status, 
    o.created_at, 
    oi.product_id,
    p.name, 
    p.price, 
    oi.quantity
    FROM  orders o 
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    `;

    return db.execute(query, [user_id]);
};