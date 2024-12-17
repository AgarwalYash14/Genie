import { useState, useEffect } from "react";
import { getDashboardStats } from "../../utils/api";
import { Calendar, TrendingUp, ChevronDown } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const TimeRangeSelector = ({ value, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
        </select>
        <ChevronDown
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
        />
    </div>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-yellow-100 bg-opacity-40 p-4 px-6 rounded-2xl border border-yellow-400 shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1 uppercase">{title}</p>
                <h3 className="text-4xl font-bold">{value}</h3>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

const RecentPaymentsTable = ({ payments }) => (
    <div className="bg-blue-50 bg-opacity-40 p-4 px-6 rounded-2xl shadow-md flex-grow border border-blue-400">
        <h3 className="text-sm text-gray-500 my-1 uppercase">Recent Payments</h3>
        <div className="overflow-auto mt-5">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b text-neutral-600 text-xs uppercase tracking-wide">
                        <th className="text-left py-2">Order ID</th>
                        <th className="text-left py-2">Customer</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments?.map((payment) => (
                        <tr key={payment._id} className="border-b text-sm">
                            <td className="py-2">
                                {payment.orderId.slice(-6)}
                            </td>
                            <td className="py-2">
                                {payment.user.first_name}{" "}
                                {payment.user.last_name}
                            </td>
                            <td className="py-2">₹{payment.summary.total}</td>
                            <td className="py-2">
                                <span
                                    className={`px-2 py-1 rounded-md text-xs uppercase ${
                                        payment.status === "captured"
                                            ? "bg-green-100 border border-green-500 text-green-800"
                                            : payment.status === "pending"
                                            ? "bg-yellow-100 border border-yellow-500 text-yellow-800"
                                            : "bg-red-100 border border-red-500 text-red-800"
                                    }`}
                                >
                                    {payment.status}
                                </span>
                            </td>
                            <td className="py-2">
                                {new Date(payment.createdAt)
                                    .toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    .replace(/\//g, "-")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const RevenueChart = ({ data }) => (
    <div className="bg-green-100 bg-opacity-40 rounded-2xl border border-green-600 shadow-md">
        <h3 className="text-sm uppercase text-gray-500 mb-6 px-6 pt-4">
            Monthly Revenue
        </h3>
        <div className="h-44 pl-1 pr-6 text-xs">
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#16a34a"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    No revenue data available
                </div>
            )}
        </div>
    </div>
);

const TopServicesChart = ({ data }) => (
    <div className="bg-red-100 bg-opacity-40 p-6 rounded-2xl border border-red-600 shadow-md">
        <h3 className="text-sm text-gray-500 mb-4 uppercase">Top Services</h3>
        <div className="h-40 space-y-4 overflow-y-auto pr-4">
            {data && data.length > 0 ? (
                data.map((service) => (
                    <div key={service._id} className="relative">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium truncate max-w-[70%]">
                                {service._id}
                            </span>
                            <span className="text-sm text-gray-500">
                                ₹{service.revenue.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                            <div
                                className="bg-red-500 rounded-full h-2"
                                style={{
                                    width: `${
                                        (service.revenue / data[0].revenue) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">
                    No services data available
                </div>
            )}
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("all");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getDashboardStats(timeRange);
                // Ensure all required properties exist with default values
                setStats({
                    totalServices: data.totalServices || 0,
                    totalServiceDetails: data.totalServiceDetails || 0,
                    totalUsers: data.totalUsers || 0,
                    totalPayments: data.totalPayments || 0,
                    revenue: data.revenue || { total: 0, count: 0 },
                    monthlyRevenue: data.monthlyRevenue || [],
                    paymentStatusStats: data.paymentStatusStats || [],
                    topServices: data.topServices || [],
                    recentPayments: data.recentPayments || [],
                    timeRange: data.timeRange,
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setError(error.message || "Failed to fetch dashboard stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Ensure we have data for all months with 0 values for missing months
    const chartData = Array.from({ length: 12 }, (_, i) => {
        const existingData = stats.monthlyRevenue.find(
            (item) => monthNames.indexOf(item.month) === i
        );
        return {
            month: monthNames[i],
            total: existingData ? existingData.total : 0,
            count: existingData ? existingData.count : 0,
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-[NeuwMachinaBold] truncate">
                    DASHBOARD
                </h1>
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Stats Grid */}
                <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <StatCard
                            title={`${
                                timeRange === "all" ? "Total" : "Period"
                            } Payments`}
                            value={stats.totalPayments}
                            icon={Calendar}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            title="Revenue"
                            value={`₹${stats.revenue.total.toLocaleString()}`}
                            icon={TrendingUp}
                            color="bg-purple-500"
                        />
                    </div>
                    <RecentPaymentsTable payments={stats.recentPayments} />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-rows-2 gap-6">
                    <RevenueChart data={chartData} />
                    <TopServicesChart data={stats.topServices} />
                </div>
            </div>
        </div>
    );
}
