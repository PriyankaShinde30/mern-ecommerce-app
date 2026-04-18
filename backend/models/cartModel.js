const db = require('../config/db');

exports.getCartByUser = async (user_id) => {
    return db.execute(
        `SELECT * FROM cart WHERE user_id = ?`,
        [user_id]
    );
};

exports.createCart = async (user_id) => {
    return db.execute(
        `INSERT INTO cart (user_id) VALUES (?)`,
        [user_id]
    );
};

exports.getCartItem = async (user_id) => {
  const query = `
    SELECT 
      c.cart_id,
      ci.cart_item_id,
      p.product_id,
      p.name,
      p.price,
      ci.quantity,
      (ci.quantity * p.price) AS total_price
    FROM cart c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN products p ON ci.product_id = p.product_id
    WHERE c.user_id = ?
  `;

  return db.execute(query, [user_id]); // ✅ now defined
};

exports.addCartItem = async (cart_id, product_id, quantity) => {
    return db.execute(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
        [cart_id, product_id, quantity]
    );
};

exports.updateCartQuantity = async (cart_item_id, quantity) => {
    return db.execute(
        `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`,
        [quantity, cart_item_id]
    );
};

exports.removeCartItem = async (cart_item_id) => {
    return db.execute(
        `DELETE FROM cart_items WHERE cart_item_id = ?`,
        [cart_item_id]
    );
};

