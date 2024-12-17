import axios from "axios";

// Set up base URL for the API and create an axios instance with default settings.
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// User Registration API
export const register = async (userData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/users/register`,
            userData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// User Login API
export const login = async (userData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/users/login`,
            userData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get User Details API
export const getUserDetails = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users/user`);
        const data = response.data;
        data.user.cart = Array.isArray(data.user.cart) ? data.user.cart : [];
        return data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error.response?.data || error.message;
    }
};

// User Logout API
export const logout = async () => {
    try {
        await axiosInstance.post(`${API_URL}/users/logout`);
    } catch (error) {
        console.error("Logout failed:", error);
        throw error.response?.data || error.message;
    }
};

// Get Services List API
export const getServices = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/services`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get Service Details API
export const getServiceDetails = async (serviceName) => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/services/${encodeURIComponent(serviceName)}/details`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update User Cart API
export const updateUserCart = async (cartItems) => {
    try {
        if (!Array.isArray(cartItems)) {
            throw new Error("Cart items should be an array");
        }

        // Transform the cart items to match backend structure
        const processedItems = cartItems.map((item) => ({
            service: item._id,
            quantity: parseInt(item.quantity, 10),
            title: item.title,
            OurPrice: parseFloat(item.OurPrice),
            total: parseFloat(item.OurPrice) * parseInt(item.quantity, 10),
            category: item.category || "",
            type: item.type || "",
            time: item.time || "",
            MRP: parseFloat(item.MRP || 0),
            description: Array.isArray(item.description)
                ? item.description
                : [],
            image: item.image || "",
        }));

        const response = await axiosInstance.put(
            `${API_URL}/users/cart`,
            processedItems
        );
        return response.data;
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error.response?.data || error.message;
    }
};

// Get User Cart API
export const getUserCart = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users/cart`);
        const data = response.data;
        return Array.isArray(data.cart) ? data.cart : [];
    } catch (error) {
        console.error("Error fetching user cart:", error);
        throw error.response?.data || error.message;
    }
};

// Clear User Cart API
export const clearUserCart = async () => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/users/cart`);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error.response?.data || error.message;
    }
};

export const createRazorpayOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/razorpay/create-order`,
            orderData
        );
        return response.data;
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw error.response?.data || error.message;
    }
};

// Verify Razorpay Payment API
export const verifyRazorpayPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/razorpay/verify-payment`,
            paymentData
        );
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error.response?.data || error.message;
    }
};

export const getUserBookings = async (userId) => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/razorpay/bookings/${userId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error.response?.data || error.message;
    }
};

//Admin API
export const getDashboardStats = async (timeRange = "all") => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/admin/dashboard/stats`,
            {
                params: { timeRange },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error.response?.data || error.message;
    }
};

export const createService = async (formData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/admin/services/`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error.response?.data || error.message;
    }
};

// Update an existing service
export const updateService = async (id, formData) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/admin/services/${id}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating service:", error);
        throw error.response?.data || error.message;
    }
};

// Delete a service
export const deleteService = async (id) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/admin/services/${id}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error.response?.data || error.message;
    }
};

// Get service details by service ID
export const getServiceDetailsById = async (serviceId) => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/admin/servicedetails/${serviceId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching service details:", error);
        throw error.response?.data || error.message;
    }
};

// Subcategory operations
export const createSubcategory = async (serviceId, formData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateSubcategory = async (serviceId, subcategoryName, formData) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteSubcategory = async (serviceId, subcategoryName) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Service Type operations
export const createServiceType = async (serviceId, subcategoryName, formData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}/types`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Add similar functions for updating and deleting service types

// Category operations
export const createCategory = async (serviceId, subcategoryName, typeName, formData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}/types/${typeName}/categories`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Add similar functions for updating and deleting categories

// Service Type operations (completing the missing functions)
export const updateServiceType = async (serviceId, subcategoryName, typeKey, formData) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}/types/${typeKey}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteServiceType = async (serviceId, subcategoryName, typeKey) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}/types/${typeKey}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Category operations (completing the missing functions)
export const updateCategory = async (serviceId, subcategoryName, typeName, categoryId, formData) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}/types/${typeName}/categories/${categoryId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteCategory = async (serviceId, subcategoryName, typeName, categoryId) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/admin/servicedetails/${serviceId}/subcategories/${subcategoryName}/types/${typeName}/categories/${categoryId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Service Detail operations
export const createServiceDetail = async (serviceId, formData) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/admin/services/${serviceId}/details`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateServiceDetail = async (serviceId, detailId, formData) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/admin/services/${serviceId}/details/${detailId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteServiceDetail = async (serviceId, detailId) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/admin/services/${serviceId}/details/${detailId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/admin/bookings`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        throw error.response?.data || error.message;
    }
};

// Update booking status (admin only)
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/admin/bookings/${bookingId}/status`,
            { status }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating booking status:", error);
        throw error.response?.data || error.message;
    }
};
