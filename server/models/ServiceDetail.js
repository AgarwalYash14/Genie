import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    category: String,
    type: String,
    image: String,
    title: String,
    time: String,
    OurPrice: Number,
    MRP: Number,
    description: [String],
});

const categorySchema = new mongoose.Schema({
    name: String,
    categoryImage: String,
    services: [serviceSchema],
});

const serviceTypeSchema = new mongoose.Schema({
    name: String,
    categoryImage: String,
    image: String,
    categories: [categorySchema],
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
        default: undefined,
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
        default: undefined,
    },
});

const ServiceDetail = mongoose.model("ServiceDetail", ServiceDetailSchema);


export default ServiceDetail;
