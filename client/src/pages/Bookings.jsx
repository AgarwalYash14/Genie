import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserBookings } from "../utils/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ImageOff } from "lucide-react";

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
            <div className="relative">
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
        <div className="pb-8">
            <h1 className="text-4xl font-bold uppercase tracking-wider pb-6 font-[NeuwMachina]">
                Your Bookings
            </h1>
            <div className="space-y-8">
                {bookings.map((booking) => (
                    <div
                        key={booking.orderId}
                        className="bg-amber-50 rounded-md shadow-lg border border-gray-500 overflow-hidden"
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

                        <div className="max-h-80 flex justify-between">
                            <div className="w-full px-6 overflow-auto">
                                {booking.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-6 border-b border-dashed border-gray-500 last:border-0"
                                    >
                                        <div className="flex items-center gap-6">
                                            {item.image ? (
                                                <img
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_BACKEND_URL
                                                    }/${item.image}`}
                                                    alt={item.title}
                                                    className="w-40 h-24 object-cover rounded-lg border border-black shadow-md"
                                                />
                                            ) : (
                                                <div className="w-40 h-24 flex flex-col gap-1 items-center justify-center border border-black bg-gray-100 rounded">
                                                    <ImageOff
                                                        size={16}
                                                        color="#525252"
                                                    />
                                                    <h1 className="text-xs text-neutral-600">
                                                        Image unavailable
                                                    </h1>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-0.5">
                                                <h3 className="font-semibold tracking-wide">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-800">
                                                    ₹{item.price.toFixed(2)}
                                                </p>
                                                <div className="flex gap-5 pt-1">
                                                    <p className="text-gray-600 text-sm">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                    {/* <p className="text-sm text-gray-800">
                                                        ₹{item.total.toFixed(2)}
                                                    </p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-1/4 min-w-60 bg-amber-100 border-l border-gray-600 p-6 sticky bottom-0">
                                <div className="h-full flex flex-col justify-between jus max-w-xs ml-auto space-y-1">
                                    <div className="flex flex-col gap-4 pr-4 overflow-auto">
                                        {booking.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="text-sm"
                                            >
                                                <h3 className="tracking-wide">
                                                    {item.title}
                                                </h3>
                                                <div className="flex justify-between text-xs">
                                                    <p className="text-gray-800">
                                                        ₹{item.price.toFixed(2)}{" "}
                                                        X {item.quantity}
                                                    </p>
                                                    <p className="text-gray-800">
                                                        ₹{item.total.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <div className="border-y border-gray-600 py-2 mt-4 text-sm">
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
                                                    ₹
                                                    {booking.summary.tax.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between tracking-wide font-bold pt-2 text-sm">
                                            <span>Total:</span>
                                            <span>
                                                ₹
                                                {booking.summary.total.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
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
