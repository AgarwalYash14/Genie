import { createContext, useContext, useState, useEffect } from "react";
import { getUserDetails, logout as logoutAPI } from "../utils/api";
import { CART_STORAGE_KEY } from "./CartContext";

const AuthContext = createContext();
const TOKEN_KEY = "userToken";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on mount and token changes
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const userData = await getUserDetails();

                if (userData.isAuthenticated && userData.user) {
                    setIsAuthenticated(true);
                    setUser(userData.user);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData.user || userData);
    };

    const handleLogout = async () => {
        try {
            // Preserve cart in local storage before logout
            const cartData = localStorage.getItem(CART_STORAGE_KEY);

            // Call logout API
            await logoutAPI();

            // Clear auth state
            setIsAuthenticated(false);
            setUser(null);

            // Restore cart data after logout
            if (cartData) {
                localStorage.setItem(CART_STORAGE_KEY, cartData);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Add isAdmin helper function
    const isAdmin = () => {
        return user?.role === "admin";
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout: handleLogout,
                isAdmin, // Add isAdmin to the context
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
