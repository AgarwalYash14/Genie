import { Link } from "react-router-dom";
import { cart } from "../assets";

export default function Cart() {
    return (
        <>
            <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">Cart</h1>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src={cart} alt="Cart" className="h-6" />
                        <span className="text-lg">Your cart is empty</span>
                    </div>
                    <Link to="/services/haircut">
                        <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}
