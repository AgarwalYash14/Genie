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
        default: 1,
    },
    category: { type: String },
    type: { type: String },
    title: { type: String },
    image: { type: String }, // Ensure 'image' is saved
    time: { type: String },
    OurPrice: { type: Number, required: true, min: 0 },
    MRP: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }, // Ensure 'total' is saved
    description: [String],
});

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    cart: { type: [cartItemSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
