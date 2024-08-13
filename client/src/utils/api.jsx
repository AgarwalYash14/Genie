import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const register = async (userData) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/register`,
            userData,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, userData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUserDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/user`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response.data ? error.response.data : error;
    }
};

export const logout = async () => {
    try {
        await axios.post(
            `${API_URL}/users/logout`,
            {},
            { withCredentials: true }
        );
    } catch (error) {
        console.error("Logout failed", error);
    }
};
