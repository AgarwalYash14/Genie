// routes/services.js
import express from "express";
import Service from "../models/Service.js";
import ServiceDetail from "../models/ServiceDetail.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services" });
    }
});

router.get("/:serviceName/details", async (req, res) => {
    try {
        const serviceDetail = await ServiceDetail.findOne({
            serviceName: req.params.serviceName,
        });
        if (serviceDetail) {
            res.json(serviceDetail);
        } else {
            res.status(404).json({ message: "Service details not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching service details" });
    }
});

export default router;
