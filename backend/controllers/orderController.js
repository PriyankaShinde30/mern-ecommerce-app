const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');

exports.checkout = async (req, res) => {
    try {
        const { user_id } = req.body;

        const [items] = await cartModel.getCartItem(user_id);

        if(items.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty'
            });
        }

        let total = 0;

        items.forEach(item => {
            total += item.total_price;
        });

        const [orderResult] = await orderModel.createOrder(user_id, total);

        const order_id = orderResult.insertId;

        for(const item of items) {
            await orderModel.createOrderItem(
                order_id,
                item.product_id, 
                item.quantity
            );
        }

        await orderModel.clearCart(items[0].cart_id);

        res.json({
            message: 'Order created successfully',
            order_id
        });
    } catch(err) {
        res.status(500).json({
            message: 'Server error',
            err
        });
    }
};

exports.getOrderHistory = async (req, res) => {
    try{
        const user_id = req.user.user_id;

        const [rows] = await orderModel.getOrderHistory(user_id);

        if(rows.length === 0) {
            return res.json({
                message: 'No orders found',
                orders: []
            });
        }

        const ordersMap = {};
        
        rows.forEach(row  => {
            if(!ordersMap[row.order_id]){ 
                ordersMap[row.order_id] = {
                    order_id : row.order_id,
                    total: row.total,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }

            ordersMap[row.order_id].items.push({
                product_id: row.product_id,
                name: row.name,
                price: row.price,
                quantity: row.quantity
            });
        });

        const orders = Object.values(ordersMap);
        
        res.json({
            message: 'Order history fetched', 
            orders
        });
    }catch (err) {
        res.status(500).json({
            message: 'Server error', 
            err: err.message
        });
    }
};