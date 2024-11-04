import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/users/register`,
            userData
        );
        return response.data;
    } catch (error) {
        throw error.response.data || error;
    }
};

export const login = async (userData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/users/login`,
            userData
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUserDetails = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users/user`);
        return response.data;
    } catch (error) {
        throw error.response.data ? error.response.data : error;
    }
};

export const logout = async () => {
    try {
        await axiosInstance.post(`${API_URL}/users/logout`);
    } catch (error) {
        console.error("Logout failed", error);
        throw error;
    }
};

export const getServices = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/services`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getServiceDetails = async (serviceName) => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/services/${encodeURIComponent(serviceName)}/details`
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateUserCart = async (cartItems) => {
    try {
        // Validate and transform cart items before sending
        const processedItems = cartItems.map(item => {
            if (!item.service || !item.quantity) {
                throw new Error("Invalid cart item: missing required fields");
            }

            // Ensure we have all required fields
            const cartItem = {
                service: item.service._id || item.service, // Handle both object and ID
                quantity: parseInt(item.quantity),
                title: item.service.title || item.title,
                price: parseFloat(item.service.OurPrice || item.price),
                total: parseFloat((item.service.OurPrice || item.price) * item.quantity)
            };

            // Add optional fields if they exist
            if (item.service.category || item.category) cartItem.category = item.service.category || item.category;
            if (item.service.type || item.type) cartItem.type = item.service.type || item.type;
            if (item.service.time || item.time) cartItem.time = item.service.time || item.time;
            if (item.service.MRP || item.MRP) cartItem.MRP = parseFloat(item.service.MRP || item.MRP);
            if (item.service.description || item.description) cartItem.description = item.service.description || item.description;

            return cartItem;
        });

        const response = await axiosInstance.put(`${API_URL}/users/cart`, processedItems);
        return response.data;
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error.response?.data || error;
    }
};

export const getUserCart = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users/cart`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const clearUserCart = async () => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/users/cart`);
        return await response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
};
