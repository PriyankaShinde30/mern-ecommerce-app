const getRazorpayInstance = require('../config/razorpay'); 
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const razorpay = getRazorpayInstance();

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "Receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json({
            message: 'Order Created', 
            order
        });

    } catch(err) {
        console.log("Error: ", err);
        res.status(500).json({
            message: 'Server error', 
            err: err.message
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {

        const { 
            razorpay_order_id, 
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: 'Invalid Payment'
            });
        }

        await db.execute(
            `UPDATE orders SET status = 'paid' WHERE razorpay_order_id = ?`,
            [razorpay_order_id]
        );

        res.json({
            message: 'Payment Verified & Order Updated'
        });

    } catch(err) {
        res.status(500).json({
            message: 'Server error',
            err: err.message
        });
    }
};