// utils/api.js
import axios from "axios";

// Create Axios instance
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach token automatically
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling (optional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error || error.message || "Something went wrong";
        return Promise.reject(message);
    }
);

export default api;
