import { createContext, useState, useEffect } from "react";
import { updateUserCart, getUserCart, getUserDetails } from "../utils/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartServices, setCartServices] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to merge cart items
    const mergeCartItems = (localCart, serverCart) => {
        const mergedCart = [...serverCart];

        localCart.forEach((localItem) => {
            const existingItem = mergedCart.find(
                (serverItem) => serverItem._id === localItem._id
            );

            if (existingItem) {
                existingItem.quantity += localItem.quantity;
            } else {
                mergedCart.push(localItem);
            }
        });

        return mergedCart;
    };

    // Initialize cart and handle login status
    useEffect(() => {
        const initializeCart = async () => {
            try {
                const userDetails = await getUserDetails();
                setIsLoggedIn(true);

                // Get local cart before clearing
                const localCart = localStorage.getItem("cartServices")
                    ? JSON.parse(localStorage.getItem("cartServices"))
                    : [];

                // Get server cart
                const serverCart = await getUserCart();

                if (localCart.length > 0) {
                    // Merge local cart with server cart
                    const mergedCart = mergeCartItems(localCart, serverCart);
                    setCartServices(mergedCart);

                    // Update server with merged cart
                    await updateUserCart(
                        mergedCart.map((item) => ({
                            service: item._id,
                            quantity: item.quantity,
                            price: item.OurPrice,
                            total: item.OurPrice * item.quantity,
                        }))
                    );

                    // Clear localStorage after successful merge
                    localStorage.removeItem("cartServices");
                } else {
                    setCartServices(serverCart);
                }
            } catch (error) {
                setIsLoggedIn(false);
                // If not logged in, use localStorage
                const localCart = localStorage.getItem("cartServices");
                if (localCart) {
                    setCartServices(JSON.parse(localCart));
                }
            }
            setLoading(false);
        };

        initializeCart();
    }, []);

    // Save cart based on login status
    useEffect(() => {
        if (!loading) {
            if (isLoggedIn) {
                // Save to backend
                updateUserCart(
                    cartServices.map((item) => ({
                        service: item._id,
                        quantity: item.quantity,
                        price: item.OurPrice,
                        total: item.OurPrice * item.quantity,
                    }))
                ).catch((error) => {
                    console.error("Failed to update cart in backend:", error);
                });
            } else {
                // Save to localStorage
                localStorage.setItem(
                    "cartServices",
                    JSON.stringify(cartServices)
                );
            }
        }
    }, [cartServices, isLoggedIn, loading]);

    // Handle logout - sync with localStorage
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem("cartServices", JSON.stringify(cartServices));
    };

    // Handle login - merge carts
    const handleLogin = async () => {
        try {
            setIsLoggedIn(true);
            const localCart = JSON.parse(
                localStorage.getItem("cartServices") || "[]"
            );
            const serverCart = await getUserCart();

            const mergedCart = mergeCartItems(localCart, serverCart);
            setCartServices(mergedCart);

            await updateUserCart(
                mergedCart.map((item) => ({
                    service: item._id,
                    quantity: item.quantity,
                    price: item.OurPrice,
                    total: item.OurPrice * item.quantity,
                }))
            );

            localStorage.removeItem("cartServices");
        } catch (error) {
            console.error("Failed to handle login cart sync:", error);
        }
    };

    const addToCart = async (service) => {
        const isServiceInCart = cartServices.find(
            (cartService) => cartService._id === service._id
        );

        const updatedServices = isServiceInCart
            ? cartServices.map((cartService) =>
                  cartService._id === service._id
                      ? { ...cartService, quantity: cartService.quantity + 1 }
                      : cartService
              )
            : [...cartServices, { ...service, quantity: 1 }];

        setCartServices(updatedServices);

        if (isLoggedIn) {
            try {
                await updateUserCart(
                    updatedServices.map((item) => ({
                        service: item._id,
                        quantity: item.quantity,
                        price: item.OurPrice,
                        total: item.OurPrice * item.quantity,
                    }))
                );
            } catch (error) {
                console.error("Failed to update cart in backend:", error);
            }
        }
    };

    const removeFromCart = async (service) => {
        const isServiceInCart = cartServices.find(
            (cartService) => cartService._id === service._id
        );

        const updatedServices =
            isServiceInCart.quantity === 1
                ? cartServices.filter(
                      (cartService) => cartService._id !== service._id
                  )
                : cartServices.map((cartService) =>
                      cartService._id === service._id
                          ? {
                                ...cartService,
                                quantity: cartService.quantity - 1,
                            }
                          : cartService
                  );

        setCartServices(updatedServices);

        if (isLoggedIn) {
            try {
                await updateUserCart(
                    updatedServices.map((item) => ({
                        service: item._id,
                        quantity: item.quantity,
                        price: item.OurPrice,
                        total: item.OurPrice * item.quantity,
                    }))
                );
            } catch (error) {
                console.error("Failed to update cart in backend:", error);
            }
        }
    };

    const clearCart = async () => {
        setCartServices([]);
        if (isLoggedIn) {
            try {
                await updateUserCart([]);
            } catch (error) {
                console.error("Failed to clear cart in backend:", error);
            }
        }
    };

    // Existing calculation functions remain the same
    const getCartCount = () => {
        return cartServices.reduce(
            (count, service) => count + service.quantity,
            0
        );
    };

    const getCartTax = () => {
        return cartServices
            .reduce((total, service) => {
                const taxPrice = service.OurPrice * 0.18;
                const tax = taxPrice * service.quantity;
                return total + tax;
            }, 0)
            .toFixed(2);
    };

    const getCartSubTotal = () => {
        return cartServices
            .reduce((total, service) => {
                const taxPrice = service.OurPrice * 0.18;
                const tax = taxPrice * service.quantity;
                return total + service.OurPrice * service.quantity - tax;
            }, 0)
            .toFixed(2);
    };

    const getCartTotal = () => {
        return cartServices
            .reduce((total, service) => {
                const totalPrice = service.OurPrice * service.quantity;
                return total + totalPrice;
            }, 0)
            .toFixed(2);
    };

    if (loading) {
        return null;
    }

    return (
        <CartContext.Provider
            value={{
                cartServices,
                addToCart,
                removeFromCart,
                clearCart,
                getCartCount,
                getCartTax,
                getCartSubTotal,
                getCartTotal,
                isLoggedIn,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
