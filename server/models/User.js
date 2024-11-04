import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceDetail",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    // Store service details directly in cart
    category: { type: String },
    type: { type: String },
    title: { type: String, required: true },
    time: { type: String },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    MRP: {
        type: Number,
        min: 0,
    },
    description: [String],
    total: {
        type: Number,
        required: true,
        min: 0,
    },
});

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    cart: {
        type: [cartItemSchema],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", UserSchema);
