import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartServices, setCartServices] = useState(
        localStorage.getItem("cartServices")
            ? JSON.parse(localStorage.getItem("cartServices"))
            : []
    );

    const addToCart = (service) => {
        const isServiceInCart = cartServices.find(
            (cartService) => cartService._id === service._id
        );

        if (isServiceInCart) {
            setCartServices(
                cartServices.map((cartService) =>
                    cartService._id === service._id
                        ? { ...cartService, quantity: cartService.quantity + 1 }
                        : cartService
                )
            );
        } else {
            setCartServices([...cartServices, { ...service, quantity: 1 }]);
        }
    };

    const removeFromCart = (service) => {
        const isServiceInCart = cartServices.find(
            (cartService) => cartService._id === service._id
        );

        if (isServiceInCart.quantity === 1) {
            setCartServices(
                cartServices.filter(
                    (cartService) => cartService._id !== service._id
                )
            );
        } else {
            setCartServices(
                cartServices.map((cartService) =>
                    cartService._id === service._id
                        ? { ...cartService, quantity: cartService.quantity - 1 }
                        : cartService
                )
            );
        }
    };

    const clearCart = () => {
        setCartServices([]);
    };

    const getCartCount = () => {
        return cartServices.reduce(
            (count, service) => count + service.quantity,
            0
        );
    };

    const getCartTotal = () => {
        return cartServices.reduce(
            (total, service) => total + service.OurPrice * service.quantity,
            0
        );
    };

    useEffect(() => {
        localStorage.setItem("cartServices", JSON.stringify(cartServices));
    }, [cartServices]);

    useEffect(() => {
        const cartServices = localStorage.getItem("cartServices");
        if (cartServices) setCartServices(JSON.parse(cartServices));
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartServices,
                addToCart,
                removeFromCart,
                clearCart,
                getCartCount,
                getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
