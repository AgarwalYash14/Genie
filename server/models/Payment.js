import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentId: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "INR",
    },
    status: {
        type: String,
        default: "pending",
    },
    method: {
        type:String,
    },
    failureReason: {
        type: String,
    },
    items: [
        {
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
                required: true,
            },
            image: String,
            title: String,
            quantity: Number,
            price: Number,
            total: Number,
        },
    ],
    summary: {
        subtotal: Number,
        tax: Number,
        total: Number,
        itemCount: Number,
    },
    customerDetails: {
        name: String,
        email: String,
        phone: String,
    },
    attempts: {
        type: Number,
    },
    lastAttemptAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
paymentSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
