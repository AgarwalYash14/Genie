import express from "express";
import Service from "../models/Service.js";
import ServiceDetail from "../models/ServiceDetail.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

const router = express.Router();

const getDateRange = (range) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
        case "today":
            return { createdAt: { $gte: today } };
        case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return { createdAt: { $gte: weekAgo } };
        case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return { createdAt: { $gte: monthAgo } };
        case "year":
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return { createdAt: { $gte: yearAgo } };
        default:
            return {}; // Return empty filter for 'all'
    }
};

router.get("/stats", async (req, res) => {
    try {
        const timeRange = req.query.timeRange || "all";
        const dateFilter = getDateRange(timeRange);

        // Get payments with populated service details
        const payments = await Payment.find(dateFilter)
            .sort({ createdAt: -1 })
            .populate("user", "first_name last_name email")
            .lean();

        // Calculate revenue statistics
        const revenueStats = payments.reduce(
            (acc, payment) => {
                if (payment.status === "captured") {
                    acc.total += payment.summary?.total || 0;
                    acc.count += 1;
                }
                return acc;
            },
            { total: 0, count: 0 }
        );

        // Top services - using items array from payments
        const serviceStats = await Payment.aggregate([
            {
                $match: {
                    ...dateFilter,
                    status: "captured",
                    "items.title": { $exists: true },
                },
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.title",
                    totalSales: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.total" },
                },
            },
            { $match: { _id: { $ne: null } } },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
        ]);

        // Payment status distribution with proper matching
        const paymentStatusStats = await Payment.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $ifNull: ["$status", "pending"] },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    status: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ["$_id", "captured"] },
                                    then: "Success",
                                },
                                {
                                    case: { $eq: ["$_id", "pending"] },
                                    then: "Pending",
                                },
                                {
                                    case: { $eq: ["$_id", "failed"] },
                                    then: "Failed",
                                },
                            ],
                            default: "Other",
                        },
                    },
                },
            },
        ]);

        // Monthly revenue calculation
        const monthlyRevenue = await Payment.aggregate([
            {
                $match: {
                    status: "captured",
                    createdAt: {
                        $gte: new Date(
                            new Date().setFullYear(new Date().getFullYear() - 1)
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    total: { $sum: "$summary.total" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Format monthly revenue data
        const formattedMonthlyRevenue = monthlyRevenue.map((item) => ({
            month: new Date(item._id.year, item._id.month - 1).toLocaleString(
                "default",
                { month: "short" }
            ),
            total: item.total || 0,
            count: item.count,
        }));

        res.json({
            totalPayments: payments.length,
            revenue: revenueStats,
            monthlyRevenue: formattedMonthlyRevenue,
            paymentStatusStats,
            topServices: serviceStats,
            recentPayments: payments.slice(0, 5),
            timeRange,
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            message: "Error fetching dashboard stats",
            error: error.message,
        });
    }
});

export default router;
