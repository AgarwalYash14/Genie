import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Service", ServiceSchema);
