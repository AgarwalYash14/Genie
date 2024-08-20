import mongoose from "mongoose";

const serviceDetailSchema = new mongoose.Schema({
    serviceName: String,
    subcategories: {
        type: Map,
        of: new mongoose.Schema({
            serviceTypes: {
                type: Map,
                of: mongoose.Schema.Types.Mixed,
            },
            services: [
                {
                    category: String,
                    image: String,
                    title: String,
                    time: String,
                    OurPrice: String,
                    MRP: String,
                    description: [String],
                },
            ],
        }),
    },
});

export default mongoose.model("ServiceDetail", serviceDetailSchema);
