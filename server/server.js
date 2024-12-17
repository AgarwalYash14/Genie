import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import userRoutes from "./routes/users.js";
import servicesRoutes from "./routes/services.js";
import razorpayRoutes from "./routes/razorpay.js";
import authRoutes from "./routes/auth.js";

import AdminServices from "./routes/AdminServices.js";
import adminDashboardRoutes from "./routes/AdminDashboard.js";
import adminServicesRouter from "./routes/AdminServicesRouter.js";
import adminBookingsRoutes from "./routes/AdminBookings.js";

// Set __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

//Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Serve static files
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/razorpay", razorpayRoutes);

app.use("/api/admin/services", AdminServices);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/servicedetails", adminServicesRouter);
app.use("/api/admin/bookings", adminBookingsRoutes);

// Add this after your other middleware
if (process.env.NODE_ENV === "development") {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    });
}

//Start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Genie")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () =>
            console.log(`Server is running on port ${PORT}`)
        );
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB", err);
    });
