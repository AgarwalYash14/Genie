// routes/services.js
import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services" });
    }
});

export default router;
