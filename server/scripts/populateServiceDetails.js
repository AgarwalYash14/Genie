// scripts/populateServiceDetails.js
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
        const serviceDetails = Object.entries(servicesDetailsData).map(
            ([serviceName, details]) => ({
                serviceName,
                subcategories: details.subcategories,
            })
        );
        const result = await ServiceDetail.insertMany(serviceDetails);
        console.log(`${result.length} service details inserted`);
    } catch (error) {
        console.error("Error populating service details:", error);
    } finally {
        mongoose.disconnect();
    }
};

populateServiceDetails();
