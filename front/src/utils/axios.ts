import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ? "" : "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error: AxiosError) {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            useAuthStore.getState().logout();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
