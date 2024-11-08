import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true,
    },
    serviceImage: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
});

export default mongoose.model("Service", ServiceSchema);
