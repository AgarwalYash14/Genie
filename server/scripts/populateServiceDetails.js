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
        await ServiceDetail.deleteMany({});

        for (const [serviceName, details] of Object.entries(
            servicesDetailsData
        )) {
            const processedSubcategories = new Map();

            for (const [subCatName, subCatDetails] of Object.entries(
                details.subcategories
            )) {
                let processedSubCategory = {
                    image: subCatDetails.image,
                };

                // Handle subcategories with serviceTypes
                if (subCatDetails.serviceTypes) {
                    processedSubCategory.serviceTypes = new Map();
                    for (const [
                        serviceTypeName,
                        serviceTypeDetails,
                    ] of Object.entries(subCatDetails.serviceTypes)) {
                        processedSubCategory.serviceTypes.set(serviceTypeName, {
                            image: serviceTypeDetails.image,
                            categories: serviceTypeDetails.categories,
                        });
                    }
                }

                // Handle subcategories with direct categories
                if (subCatDetails.categories) {
                    processedSubCategory.categories = subCatDetails.categories;
                }

                processedSubcategories.set(subCatName, processedSubCategory);
            }

            const serviceDetailData = {
                serviceName,
                subcategories: processedSubcategories,
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
            console.log(`Inserted service detail for: ${serviceName}`);
        }

        console.log("All service details inserted successfully");
    } catch (error) {
        console.error("Error populating service details:", error);
    } finally {
        mongoose.disconnect();
    }
};

populateServiceDetails();
