import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Service from "../models/Service.js";
import ServiceDetail from "../models/ServiceDetail.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/services/");
    },
    filename: (req, file, cb) => {
        cb(null, `service-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === ".svg" || ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
});

// Get service details by service ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const serviceDetails = await ServiceDetail.findOne({ 
            serviceName: service.serviceName 
        });

        if (!serviceDetails) {
            return res.status(404).json({ message: "Service details not found" });
        }

        res.json(serviceDetails);
    } catch (error) {
        console.error("Error fetching service details:", error);
        res.status(500).json({
            message: "Error fetching service details",
            error: error.message,
        });
    }
});

// Subcategory Routes
router.post("/:id/subcategories", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const serviceDetail = await ServiceDetail.findOne({ 
            serviceName: service.serviceName 
        });

        if (!serviceDetail) {
            return res.status(404).json({ message: "Service details not found" });
        }

        if (serviceDetail.subcategories.has(name)) {
            return res.status(400).json({ message: "Subcategory already exists" });
        }

        const subcategory = {
            image: req.file ? `assets/services/${req.file.filename}` : "",
            serviceTypes: new Map(),
            categories: []
        };

        serviceDetail.subcategories.set(name, subcategory);
        await serviceDetail.save();

        res.status(201).json({ name, ...subcategory });
    } catch (error) {
        console.error("Error creating subcategory:", error);
        res.status(500).json({ message: "Error creating subcategory", error: error.message });
    }
});

router.put("/:id/subcategories/:name", upload.single("image"), async (req, res) => {
    try {
        const { id, name } = req.params;
        const { newName } = req.body;
        
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const serviceDetail = await ServiceDetail.findOne({ 
            serviceName: service.serviceName 
        });

        if (!serviceDetail) {
            return res.status(404).json({ message: "Service details not found" });
        }

        if (!serviceDetail.subcategories.has(name)) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        const subcategory = serviceDetail.subcategories.get(name);
        if (req.file) {
            // Delete old image if it exists
            if (subcategory.image) {
                const oldImagePath = path.join(process.cwd(), "public", subcategory.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            subcategory.image = `assets/services/${req.file.filename}`;
        }

        if (newName && newName !== name) {
            serviceDetail.subcategories.delete(name);
            serviceDetail.subcategories.set(newName, subcategory);
        }

        await serviceDetail.save();
        res.json({ name: newName || name, ...subcategory });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Error updating subcategory", error: error.message });
    }
});

router.delete("/:id/subcategories/:name", async (req, res) => {
    try {
        const { id, name } = req.params;
        
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const serviceDetail = await ServiceDetail.findOne({ 
            serviceName: service.serviceName 
        });

        if (!serviceDetail) {
            return res.status(404).json({ message: "Service details not found" });
        }

        if (!serviceDetail.subcategories.has(name)) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        const subcategory = serviceDetail.subcategories.get(name);
        if (subcategory.image) {
            const imagePath = path.join(process.cwd(), "public", subcategory.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        serviceDetail.subcategories.delete(name);
        await serviceDetail.save();

        res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Error deleting subcategory", error: error.message });
    }
});

// Service Type Routes
router.post("/:id/subcategories/:subcategoryName/types", upload.single("image"), async (req, res) => {
    try {
        const { id, subcategoryName } = req.params;
        const { name } = req.body;
        
        const serviceDetail = await ServiceDetail.findOne({ 
            serviceName: (await Service.findById(id))?.serviceName 
        });

        if (!serviceDetail?.subcategories.has(subcategoryName)) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        const subcategory = serviceDetail.subcategories.get(subcategoryName);
        if (subcategory.serviceTypes.has(name)) {
            return res.status(400).json({ message: "Service type already exists" });
        }

        const serviceType = {
            image: req.file ? `assets/services/${req.file.filename}` : "",
            categories: []
        };

        subcategory.serviceTypes.set(name, serviceType);
        await serviceDetail.save();

        res.status(201).json({ name, ...serviceType });
    } catch (error) {
        console.error("Error creating service type:", error);
        res.status(500).json({ message: "Error creating service type", error: error.message });
    }
});

// Add similar PUT and DELETE routes for service types

// Category Routes
router.post("/:id/subcategories/:subcategoryName/types/:typeName/categories", upload.single("image"), async (req, res) => {
    try {
        const { id, subcategoryName, typeName } = req.params;
        const { name, services } = req.body;
        
        const serviceDetail = await ServiceDetail.findOne({ 
            serviceName: (await Service.findById(id))?.serviceName 
        });

        if (!serviceDetail?.subcategories.has(subcategoryName)) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        const subcategory = serviceDetail.subcategories.get(subcategoryName);
        if (!subcategory.serviceTypes.has(typeName)) {
            return res.status(404).json({ message: "Service type not found" });
        }

        const serviceType = subcategory.serviceTypes.get(typeName);
        const category = {
            name,
            categoryImage: req.file ? `assets/services/${req.file.filename}` : "",
            services: services || []
        };

        serviceType.categories.push(category);
        await serviceDetail.save();

        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
});

// Add similar PUT and DELETE routes for categories

export default router; 