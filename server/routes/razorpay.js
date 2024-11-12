import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

import Payment from "../models/Payment.js";

const router = express.Router();
dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test route to verify the router is working
router.get("/test", (req, res) => {
    res.json({ message: "Razorpay routes are working" });
});

// Create order route
router.post("/create-order", async (req, res) => {
    try {
        // Extract the order details
        const { amount, currency, receipt, notes } = req.body;

        // Create order options
        const options = {
            amount: parseInt(amount),
            currency: currency || "INR",
            receipt,
            notes,
            payment_capture: 1, // Auto capture payment
        };

        // Add detailed order information
        if (notes && notes.items) {
            options.notes = {
                ...notes,
                items_summary: notes.items, // This will be visible in Razorpay dashboard
            };
        }

        const order = await razorpay.orders.create(options);

        // Log order creation for debugging
        console.log("Order created successfully:", {
            orderId: order.id,
            amount: order.amount,
            receipt: order.receipt,
        });

        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message,
        });
    }
});
// Verify payment route
router.post("/verify-payment", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails,
            userId,
        } = req.body;

        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }

        // Create payment document
        const paymentDoc = {
            user: userId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            amount: orderDetails.amount,
            currency: orderDetails.currency,
            status: "completed",
            items: orderDetails.items,
            summary: orderDetails.summary,
            customerDetails: orderDetails.customerDetails,
        };

        // Save payment
        const payment = new Payment(paymentDoc);
        await payment.save();

        res.json({
            success: true,
            message: "Payment verified and saved successfully",
            payment: payment,
        });
    } catch (error) {
        console.error("Error in verify-payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
            error: error.message,
        });
    }
});

// Add new route to get user bookings
router.get("/bookings/:userId", async (req, res) => {
    try {
        const bookings = await Payment.find({
            user: req.params.userId,
            status: "completed",
        }).sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message,
        });
    }
});

export default router;