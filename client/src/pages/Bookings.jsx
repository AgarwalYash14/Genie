import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserBookings } from "../utils/api";
import { format } from "date-fns";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (!user?._id) {
                    setError("Please login to view your bookings");
                    setLoading(false);
                    return;
                }

                const data = await getUserBookings(user._id);
                setBookings(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to load bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (loading) {
        return (
            <div className="py-8">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6">
                    Loading Bookings...
                </h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6">
                    Your Bookings
                </h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="py-8">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6">
                    Your Bookings
                </h1>
                <p className="text-gray-600">No bookings found.</p>
            </div>
        );
    }

    return (
        <div className="py-8">
            <h1 className="text-4xl font-bold uppercase tracking-wider pb-6">
                Your Bookings
            </h1>
            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div
                        key={booking.orderId}
                        className="rounded-lg shadow-md border border-black overflow-hidden"
                    >
                        <div className="bg-yellow-200 flex justify-between items-center p-4 border-b border-black">
                            <div className="flex gap-10">
                                <div>
                                    <h1 className="text-sm">Order</h1>
                                    <h1 className="text-sm text-gray-600">
                                        #{booking.orderId}
                                    </h1>
                                </div>
                                <div>
                                    <h1 className="text-sm">Order Placed on</h1>
                                    <p className="text-sm text-gray-600">
                                        {format(
                                            new Date(booking.createdAt),
                                            "PPpp"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                                    {booking.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            {booking.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${item.image}`}
                                            alt={item.title}
                                            className="w-36 h-20 object-cover text-xs border border-black bg-gray-100 rounded"
                                        />
                                        <div>
                                            <h3 className="font-medium">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800">
                                        ₹{item.total.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>
                                    ₹{booking.summary.subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax:</span>
                                <span>₹{booking.summary.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold mt-2">
                                <span>Total:</span>
                                <span>₹{booking.summary.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
