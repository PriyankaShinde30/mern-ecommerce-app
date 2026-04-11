const cartModel = require('../models/cartModel');

exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        const [cartRows] = await cartModel.getCartByUser(user_id);

        let cart_id;

        if(cartRows.length === 0) {
            const [newCart] = await cartModel.createCart(user_id);
            cart_id = newCart.insertId;
        }else {
            cart_id = cartRows[0].cart_id;
        }

        const [items] = await cartModel.getCartItem(cart_id, product_id);

        if(items.length > 0) {
            const item = items[0];
            const newQuantity = item.quantity + quantity;

            await cartModel.updateCartItem(item.cart_item_id, newQuantity);
            
            return res.json({
                message: 'Cart updated'
            });
        }

        await cartModel.addCartItem(cart_id, product_id, quantity);

        res.json({
            message: 'Product added to cart'
        });
    } catch(err) {
        res.status(500).json({
            message: 'Server error',
            err
        });
    }
};

exports.getCart = async (req, res) => {
  try {

    const { user_id } = req.params;   // ✅ get user_id from URL

    const [items] = await cartModel.getCartItem(user_id);

    res.status(200).json({
      message: "Cart fetched successfully",
      items
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      err: error.message
    });
  }
};

exports.updateCartQuantity = async (req, res) => {
    try {
        const { cart_item_id, quantity } = req.body;

        if(!cart_item_id || quantity < 1) {
            return res.status(400).json({
                message: 'Invalid data'
            });
        }

        await cartModel.updateCartQuantity(cart_item_id, quantity);

        res.json({
            message: 'Cart quantity updated'
        });
    } catch(err) {
        res.status(500).json({
            message: 'Server error', 
            err
        });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { cart_item_id } = req.params;

        await cartModel.removeCartItem(cart_item_id);

        res.json({
            message: 'Item removed from cart'
        });
    } catch(err) {
        res.status(500).json({
            message: 'Server error', 
            err
        });
    }
};