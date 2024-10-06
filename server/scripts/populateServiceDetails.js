import mongoose from "mongoose";
import dotenv from "dotenv";
import ServiceDetail from "../models/ServiceDetail.js";
import { servicesDetailsData } from "../data/servicesDetailsData.js";

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

const populateServiceDetails = async () => {
    try {
        await ServiceDetail.deleteMany({}); // Clear existing service details

        for (const [serviceName, details] of Object.entries(
            servicesDetailsData
        )) {
            const serviceDetailData = {
                serviceName,
                subcategories: details.subcategories,
                services: details.services,
            };

            // Remove undefined fields
            Object.keys(serviceDetailData).forEach(
                (key) =>
                    serviceDetailData[key] === undefined &&
                    delete serviceDetailData[key]
            );

            const serviceDetail = new ServiceDetail(serviceDetailData);

            await serviceDetail.save();
            const insertedDoc = await ServiceDetail.findOne({ serviceName });
        }

        console.log("All service details inserted successfully");
    } catch (error) {
        console.error("Error populating service details:", error);
    } finally {
        mongoose.disconnect();
    }
};

populateServiceDetails();
