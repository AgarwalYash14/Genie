import mongoose from "mongoose";

const serviceDetailSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    time: String,
    MRP: String,
    category: String,
    type: String
});

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
    // details: [serviceDetailSchema],
    subcategories: {
        type: Map,
        of: {
            image: String,
            serviceTypes: {
                type: Map,
                of: {
                    image: String,
                    categories: [{
                        name: String,
                        categoryImage: String,
                        services: [serviceDetailSchema]
                    }]
                }
            },
            categories: [{
                name: String,
                categoryImage: String,
                services: [serviceDetailSchema]
            }]
        }
    }
});

export default mongoose.model("Service", ServiceSchema);
