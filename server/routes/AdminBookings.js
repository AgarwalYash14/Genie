import express from "express";
import Payment from "../models/Payment.js";
const router = express.Router();

// Get all bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Payment.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// Update booking status
router.put("/:bookingId/status", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "SERVICE_BOOKED",
            "PROVIDER_ASSIGNED",
            "SERVICE_COMPLETED",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await Payment.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Error updating booking status" });
    }
});

export default router;