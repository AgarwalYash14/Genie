import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserBookings } from "../utils/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth(); // Include isAuthenticated
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            setError("Please login to view your bookings");
            navigate("/");
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            try {
                if (user && user._id) {
                    const data = await getUserBookings(user._id);

                    setBookings(data || []);
                    setError(null);
                } else {
                    setError("User ID is missing. Please login again.");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to load bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            setLoading(true); // Trigger loading indicator on auth change
            console.log("User authenticated");
            console.log("user", user);

            fetchBookings();
        }
    }, [isAuthenticated, user]); // Watch for both isAuthenticated and user

    if (loading) {
        return (
            <div className="pb-8">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6  font-[NeuwMachina]">
                    Loading Bookings...
                </h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pb-8">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6  font-[NeuwMachina]">
                    Your Bookings
                </h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="relative h-[77.45vh]">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6  font-[NeuwMachina]">
                    Your Bookings
                </h1>
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 text-lg">
                    No bookings found.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-[77.45vh] pb-8">
            <h1 className="text-4xl font-bold uppercase tracking-wider pb-4 font-[NeuwMachina] border-b border-gray-600">
                Your Bookings
            </h1>
            <div className="space-y-8 pt-10">
                {bookings.map((booking) => (
                    <div
                        key={booking.orderId}
                        className="bg-white rounded-md shadow-lg border border-gray-500 overflow-hidden"
                    >
                        <div className="bg-yellow-200 flex justify-between items-center p-6 py-3 border-b border-gray-500">
                            <div className="flex gap-12">
                                <div>
                                    <h1 className="text-sm font-medium text-gray-600">
                                        Order
                                    </h1>
                                    <h1 className="text-sm">
                                        #{booking.orderId}
                                    </h1>
                                </div>
                                <div>
                                    <h1 className="text-sm font-medium text-gray-600">
                                        Order Placed
                                    </h1>
                                    <p className="text-sm">
                                        {format(
                                            new Date(booking.createdAt),
                                            "PPpp"
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <h1 className="text-sm font-medium text-gray-600">
                                        Payment Method
                                    </h1>
                                    <p className="text-sm">{booking.method}</p>
                                </div>
                            </div>
                            <span className="inline-block px-2 py-1.5 text-xs font-semibold tracking-wider rounded bg-green-100 text-green-800 border border-green-800 uppercase">
                                {booking.status}
                            </span>
                        </div>

                        <div className="h-full flex justify-between">
                            <div className="w-full px-6">
                                {booking.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-6 border-b border-gray-200 last:border-0"
                                    >
                                        <div className="flex items-center gap-6">
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_BACKEND_URL
                                                }/${item.image}`}
                                                alt={item.title}
                                                className="w-40 h-24 object-cover rounded-lg shadow-md"
                                            />
                                            <div className="flex flex-col gap-0.5">
                                                <h3 className="font-semibold tracking-wide leading-[1.1]">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-800">
                                                    ₹{item.total.toFixed(2)}
                                                </p>
                                                <p className="text-gray-600 text-sm pt-1">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-1/5 min-w-60 bg-gray-50 border-l border-gray-300 p-6">
                                <div className="h-full flex flex-col justify-end max-w-xs ml-auto space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal:</span>
                                        <span>
                                            ₹
                                            {booking.summary.subtotal.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax:</span>
                                        <span>
                                            ₹{booking.summary.tax.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base tracking-wide font-bold pt-2 border-t">
                                        <span>Total:</span>
                                        <span>
                                            ₹{booking.summary.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
