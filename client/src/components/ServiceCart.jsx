import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { cart, clearCartImg } from "../assets";
import { Link } from "react-router-dom";

export default function ServiceCart() {
    const { cartServices, addToCart, removeFromCart, clearCart, getCartTotal } =
        useContext(CartContext);

    return (
        <div className="flex flex-col justify-between h-full w-full overflow-hidden">
            <div className="bg-yellow-200 flex items-center justify-between border-b border-black py-4 px-4 mb-4 overflow-hidden">
                <h1 className="text-lg font-semibold">Cart</h1>
                <button
                    onClick={clearCart}
                    className="underline-offset-2 text-sm rounded"
                >
                    <img
                        src={clearCartImg}
                        alt=""
                        className="h-5 text-red-600"
                    />
                </button>
            </div>
            <div className="h-full overflow-y-auto mx-4 pr-4">
                {cartServices.map((service, id) => (
                    <div key={id}>
                        <div className="flex justify-between items-end gap-4">
                            <div className=" flex gap-4 w-2/3">
                                {/* <div>
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/${service.image}`}
                                        alt={service.title} loading="lazy"
                                        className="w-16 h-12 object-cover text-xs border border-black bg-gray-100 rounded"
                                    />
                                </div> */}
                                <div className="text-sm">
                                    <p>{service.title}</p>
                                    <p className="text-zinc-600">
                                        ₹{service.OurPrice}
                                    </p>
                                </div>
                            </div>

                            <div className="w-20 h-7 flex items-center justify-center text-sm border border-black rounded overflow-hidden">
                                <button
                                    onClick={() => removeFromCart(service)}
                                    className="w-full h-full bg-yellow-300 text-black border-r border-black pt-1 pb-1.5 leading-[1] hover:bg-amber-300 transition-colors duration-300"
                                >
                                    -
                                </button>
                                <span className="bg-[#FFFFEE] w-20 h-full leading-[1.625rem] text-center">
                                    {
                                        cartServices.find(
                                            (cartService) =>
                                                cartService._id === service._id
                                        ).quantity
                                    }
                                </span>
                                <button
                                    onClick={() => addToCart(service)}
                                    className="w-full h-full bg-yellow-300 text-black border-l border-black pt-1 pb-1.5 leading-[1] hover:bg-amber-300 transition-colors duration-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {id < cartServices.length - 1 && (
                            <hr className="border-t border-dashed border-black my-4" />
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-blue-400 flex items-center justify-between p-3 px-4 mt-4 border-t border-black text-nowrap text-sm uppercase">
                <div className="flex gap-2">
                    <p>Total:</p>
                    <p>₹{getCartTotal()}</p>
                </div>
                <Link
                    to="/viewcart"
                    className="text- flex gap-2 items-center uppercase text-xs tracking-wider font-bold"
                >
                    <svg
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 48 48"
                        style={{ enableBackground: "new 0 0 48 48" }}
                        width="20px"
                        height="20px"
                    >
                        <path
                            style={{
                                fill: "none",
                                stroke: "#000000",
                                strokeWidth: 4,
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeMiterlimit: 10,
                            }}
                            d="  M36.362,32.5H17.638c-2.401,0-4.462-1.706-4.912-4.064L9.5,11.5h35l-3.226,16.936C40.825,30.794,38.763,32.5,36.362,32.5z"
                            fill="#000000"
                        />
                        <path
                            style={{
                                fill: "none",
                                stroke: "#000000",
                                strokeWidth: 4,
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeMiterlimit: 10,
                            }}
                            d="  M9.5,11.5L9.203,9.939C8.933,8.524,7.696,7.5,6.256,7.5H3.5"
                            fill="#000000"
                        />
                        <circle cx="20" cy="39" r="3" fill="#000000" />
                        <circle cx="34" cy="39" r="3" fill="#000000" />
                    </svg>
                    View Cart
                </Link>
            </div>
        </div>
    );
}
