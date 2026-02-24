import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosError } from "axios";
import { SERVER_URL } from "../constants";

export const axiosInstance = axios.create({
    baseURL: SERVER_URL,
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
    },
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
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
