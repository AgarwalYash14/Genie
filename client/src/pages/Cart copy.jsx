import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { cart } from "../assets";
import { useNavigate } from "react-router-dom";
import {
    clearUserCart,
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PortalContext from "../context/PortalContext";

export default function Cart() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const { openLogin } = useContext(PortalContext);

    const navigateToHome = () => {
        navigate("/");
    };

    const {
        cartServices,
        addToCart,
        removeFromCart,
        getCartTax,
        getCartSubTotal,
        getCartTotal,
    } = useContext(CartContext);

    if (cartServices.length === 0) {
        return (
            <>
                <div className="h-[75vh] flex flex-col items-center justify-center py-8">
                    <img src={cart} alt="Empty Cart" className="h-14 mb-4" />
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-lg text-gray-600">
                        Looks like you haven&apos;t added anything to your cart
                        yet.
                    </p>
                    <button
                        onClick={() => navigateToHome()}
                        className="mt-6 px-6 py-3 bg-yellow-300 border border-dashed border-black text-sm font-semibold shadow-inner uppercase tracking-wider rounded-md hover:bg-blue-400 hover:text-white transition-colors duration-300"
                    >
                        Start Booking Services
                    </button>
                </div>
            </>
        );
    }

    const handlePaymentWrap = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            openLogin();
            return;
        } else {
            handlePayment();
        }
    };

    const handlePayment = async () => {
        try {
            // Calculate cart totals
            const subtotal = getCartSubTotal();
            const tax = getCartTax();
            const total = getCartTotal();

            // Create order
            const orderData = {
                _id: user._id,
                amount: parseFloat((total * 100).toFixed(2)),
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                items: cartServices.map((service) => ({
                    serviceId: service._id,
                    image: service.image,
                    title: service.title,
                    quantity: service.quantity,
                    price: service.OurPrice,
                    total: service.OurPrice * service.quantity,
                })),
                summary: {
                    subtotal,
                    tax,
                    total,
                    itemCount: cartServices.length,
                },
                customerDetails: {
                    name: user.first_name,
                    email: user.email,
                    phone: user.phone,
                },
            };

            const order = await createRazorpayOrder(orderData);

            // Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "GENIE",
                description: `Order Total: ₹${total} (Incl. GST)`,
                image: "https://raw.githubusercontent.com/AgarwalYash14/Genie/main/client/public/logo.png",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        console.log("Full Razorpay Response:", response);

                        const verificationData = {
                            userId: user._id,
                            razorpay_order_id: order.id, // Use the order ID from the created order
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderDetails: orderData,
                        };

                        const verification = await verifyRazorpayPayment(
                            verificationData
                        );

                        if (verification.success) {
                            cartServices.forEach((service) => {
                                removeFromCart(service);
                            });
                            await clearUserCart();
                            navigate("/bookings");
                        } else {
                            throw new Error(
                                verification.message ||
                                    "Payment verification failed"
                            );
                        }
                        console.log("verificationData", verificationData);
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        alert(
                            "Payment verification failed. Please contact support."
                        );
                    }
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                    contact: user.phone || "",
                },
                theme: {
                    color: "#FFFFEE",
                },
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error("Payment initialization failed:", error);
            alert("Unable to initialize payment. Please try again later.");
        }
    };

    return (
        <div className="flex gap-6 pb-8">
            <div className="w-3/4 h-full pr-6 border-r border-black">
                <h1 className="text-4xl font-bold uppercase tracking-wider pb-6 font-[NeuwMachina]">
                    Cart
                </h1>
                <div className="w-full grid grid-cols-6 gap-8 text-gray-600 text-sm tracking-wider uppercase py-2 pr-8">
                    <h1>Service</h1>
                    <h1 className="col-span-3">Description</h1>
                    <h1>Price</h1>
                    <h1>Quantity</h1>
                </div>
                <hr className="mt-1 mb-6 border-t border-gray-600" />
                <div className="h-[57.6vh] overflow-y-auto">
                    {cartServices.map((service, id) => (
                        <div key={id} className="mr-6">
                            <div className="flex justify-between gap-4">
                                <div className="w-full grid grid-cols-6 gap-8">
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/${service.image}`}
                                        alt={service.title}
                                        className="w-36 h-20 object-cover text-xs border border-black bg-gray-100 rounded"
                                    />
                                    <p className="h-full flex items-center col-span-3">
                                        {service.title}
                                    </p>
                                    <p className="h-full flex items-center">
                                        ₹{service.OurPrice}
                                    </p>
                                    <div className="h-full flex items-center">
                                        <div className="w-20 h-7 flex items-center justify-center text-sm border border-black rounded overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    removeFromCart(service)
                                                }
                                                className="w-full h-full bg-yellow-300 text-black border-r border-black pt-1 pb-1.5 leading-[1] hover:bg-amber-300 transition-colors duration-300"
                                            >
                                                -
                                            </button>
                                            <span className="bg-[#FFFFEE] w-20 h-full leading-[1.625rem] text-center">
                                                {
                                                    cartServices.find(
                                                        (cartService) =>
                                                            cartService._id ===
                                                            service._id
                                                    ).quantity
                                                }
                                            </span>
                                            <button
                                                onClick={() =>
                                                    addToCart(service)
                                                }
                                                className="w-full h-full bg-yellow-300 text-black border-l border-black pt-1 pb-1.5 leading-[1] hover:bg-amber-300 transition-colors duration-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {id < cartServices.length - 1 && (
                                <hr className="border-t border-dashed border-black my-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-1/4 bg-yellow-200 flex flex-col justify-between rounded-md overflow-hidden">
                <div className="p-5">
                    <h1 className="text-2xl font-bold uppercase tracking-wider pb-4">
                        Order Summary
                    </h1>
                    <div className="h-full flex flex-col justify-between">
                        <div className="h-[31vh] pr-4 overflow-y-auto">
                            {cartServices.map((service, id) => (
                                <div key={id}>
                                    <p className="h-full flex items-center col-span-3 text-neutral-800">
                                        {service.title}
                                    </p>
                                    <div className="flex justify-between text-neutral-600 text-sm tracking-wider">
                                        <div className="flex items-center">
                                            <p>₹{service.OurPrice}</p>
                                            <span className="px-2">X</span>
                                            <p>
                                                {
                                                    cartServices.find(
                                                        (cartService) =>
                                                            cartService._id ===
                                                            service._id
                                                    ).quantity
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                ₹
                                                {service.OurPrice *
                                                    service.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    {id < cartServices.length - 1 && (
                                        <hr className="border-t border-dashed border-black my-3" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="py-2 border-y border-black">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-sm font-bold uppercase tracking-wider">
                                        Subtotal
                                    </h1>
                                    <p>₹{getCartSubTotal()}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-sm font-bold uppercase tracking-wider">
                                        Tax
                                    </h1>
                                    <p>₹{getCartTax()}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3">
                                <h1 className="text-sm font-bold uppercase tracking-wider">
                                    Total
                                </h1>
                                <p>₹{getCartTotal()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={(e) => handlePaymentWrap(e)}
                    className="w-full tracking-wider bg-blue-800 text-white p-6 hover:bg-blue-900 transition-colors duration-300"
                >
                    CHECK OUT
                </button>
            </div>
        </div>
    );
}
