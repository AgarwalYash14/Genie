import { useState, useEffect } from "react";
import { getAllBookings, updateBookingStatus } from "../../utils/api";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getAllBookings();
            setBookings(data || []);
            setError(null);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Failed to load bookings. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            // Refresh bookings after status update
            fetchBookings();
        } catch (error) {
            console.error("Error updating booking status:", error);
            alert("Failed to update booking status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "SERVICE_BOOKED":
                return "bg-yellow-100 text-yellow-800 border-yellow-800";
            case "PROVIDER_ASSIGNED":
                return "bg-blue-100 text-blue-800 border-blue-800";
            case "SERVICE_COMPLETED":
                return "bg-green-100 text-green-800 border-green-800";
            default:
                return "bg-gray-100 text-gray-800 border-gray-800";
        }
    };

    if (loading) {
        return <div className="p-6">Loading bookings...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-[NeuwMachinaBold] truncate mb-6 uppercase">Manage Bookings</h1>
            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div
                        key={booking.orderId}
                        className="bg-yellow-100 bg-opacity-40 rounded-lg shadow-md border border-neutral-950"
                    >
                        <div className="p-4 border-b border-neutral-950 flex justify-between items-center">
                            <div className="space-x-6">
                                <span className="font-medium">
                                    Order #{booking.orderId}
                                </span>
                                <span className="text-gray-600">
                                    {format(
                                        new Date(booking.createdAt),
                                        "PPpp"
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded border ${getStatusColor(
                                        booking.status
                                    )}`}
                                >
                                    {booking.status.replace(/_/g, " ")}
                                </span>
                                <select
                                    className="border rounded px-2 py-1 text-sm"
                                    value={booking.status}
                                    onChange={(e) =>
                                        handleStatusUpdate(
                                            booking._id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="SERVICE_BOOKED">
                                        Service Booked
                                    </option>
                                    <option value="PROVIDER_ASSIGNED">
                                        Provider Assigned
                                    </option>
                                    <option value="SERVICE_COMPLETED">
                                        Service Completed
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <h3 className="font-medium mb-2">
                                    Customer Details
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p>Name: {booking.customerDetails.name}</p>
                                    <p>Email: {booking.customerDetails.email}</p>
                                    <p>Phone: {booking.customerDetails.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {booking.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 border-t border-gray-400 pt-4"
                                    >
                                        {item.image ? (
                                            <img
                                                src={`${
                                                    import.meta.env.VITE_BACKEND_URL
                                                }/${item.image}`}
                                                alt={item.title}
                                                className="w-24 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-24 h-16 flex flex-col gap-1 items-center justify-center bg-gray-100 rounded">
                                                <ImageOff
                                                    size={16}
                                                    color="#525252"
                                                />
                                                <span className="text-xs text-gray-500">
                                                    No image
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × ₹
                                                {item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                ₹{item.total}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-400">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>₹{booking.summary.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax:</span>
                                    <span>₹{booking.summary.tax}</span>
                                </div>
                                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-neutral-500">
                                    <span>Total:</span>
                                    <span>₹{booking.summary.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 