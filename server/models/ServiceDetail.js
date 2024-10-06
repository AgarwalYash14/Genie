import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    category: String,
    type: String,
    image: String,
    title: String,
    time: String,
    OurPrice: String,
    MRP: String,
    description: [String],
});

const serviceTypeSchema = new mongoose.Schema({
    image: String,
    services: [serviceSchema],
});

const subcategorySchema = new mongoose.Schema({
    image: String,
    serviceTypes: {
        type: Map,
        of: serviceTypeSchema,
        required: false,
    },
    services: {
        type: [serviceSchema],
        required: false,
    },
});

const ServiceDetailSchema = new mongoose.Schema({
    serviceName: String,
    subcategories: {
        type: Map,
        of: subcategorySchema,
        required: false,
    },
    services: {
        type: [serviceSchema],
        required: false,
    },
});

const ServiceDetail = mongoose.model("ServiceDetail", ServiceDetailSchema);

export default ServiceDetail;
