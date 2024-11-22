import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: String,
    image: String,
    time: String,
    OurPrice: String,
    MRP: String,
    description: [String],
});

const categorySchema = new mongoose.Schema({
    name: String,
    categoryImage: String,
    services: [serviceSchema],
});

const serviceTypeSchema = new mongoose.Schema({
    image: String,
    categories: [categorySchema],
});

const subcategorySchema = new mongoose.Schema({
    image: String,
    // Make both serviceTypes and categories optional
    serviceTypes: {
        type: Map,
        of: {
            image: String,
            categories: [categorySchema],
        },
        required: false,
    },
    // Direct categories for subcategories without serviceTypes
    categories: {
        type: [categorySchema],
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
