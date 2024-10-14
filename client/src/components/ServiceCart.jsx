import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { clearCartImg } from "../assets";

export default function ServiceCart() {
    const { cartServices, addToCart, removeFromCart, clearCart, getCartTotal } =
        useContext(CartContext);

    return (
        <div className="flex flex-col justify-between h-full w-full">
            <div className="flex items-center justify-between pb-2">
                <h1 className="text-xl font-bold">Cart</h1>
                <button
                    onClick={clearCart}
                    className="underline-offset-2 text-sm rounded"
                >
                    <img
                        src={clearCartImg}
                        alt=""
                        className="h-4 text-red-600"
                    />
                </button>
            </div>
            <div className="h-full overflow-y-auto mb-4">
                {cartServices.map((service, id) => (
                    <div key={id} className="mr-4">
                        <div className="flex justify-between items-end gap-4 py-4">
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
                            <hr className="border-t border-dashed border-black" />
                        )}
                    </div>
                ))}
            </div>
            <div className="bg-blue-400 flex items-center justify-between p-2 px-4 rounded-full text-neutral-100 border border-black text-nowrap">
                <div className="w-full flex justify-between">
                    <p>Total:</p>
                    <p>₹{getCartTotal()}</p>
                </div>
            </div>
        </div>
    );
}
