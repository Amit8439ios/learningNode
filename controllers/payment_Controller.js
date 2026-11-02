
const Product = require("../models/Product");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");



const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive integer",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        console.log("Product ID:", productId);
        console.log("Product document:", product);
        console.log("Product price:", product?.price);


        const totalAmount = product.price * quantity;


        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        })

        const newOrder = await Order.create({
            userId: req.user.userId,
            item: [
                {
                    productId: product._id,
                    quantity,
                    price: product.price,
                },
            ],
            totalAmount,
            razorpayOrderId: razorpayOrder.id,
            status: "PENDING",
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            checkout: {
                key: process.env.RAZORPAY_KEY_ID,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            order: newOrder,
        });
    } catch (err) {
        console.error("Create order error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;

        // Step 1: Validate the received payment details


        console.log("VERIFY PAYMENT API CALLED");
        console.log("Request body:", req.body);
        console.log("Authenticated user:", req.user);

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required",
            });
        }

        // Step 2: Find the order in our database
        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user.userId,
            status: "PENDING",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Step 3: Build the expected signature
        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${order.razorpayOrderId}|${razorpay_payment_id}`
            )
            .digest("hex");

        // Step 4: Compare signatures safely
        const expectedBuffer = Buffer.from(
            expectedSignature,
            "hex"
        );

        const receivedBuffer = Buffer.from(
            razorpay_signature,
            "hex"
        );

        const isValid =
            /^[a-f0-9]{64}$/i.test(razorpay_signature) &&
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(
                expectedBuffer,
                receivedBuffer
            );

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Step 5: Update the order only after verification
        // if 9

        order.status = "COMPLETED";
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment signature verified successfully",
            orderId: order._id,
            status: order.status,
        });

    } catch (err) {
        console.error("Payment verification error:", err);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};


module.exports = { createOrder, verifyPayment };
