import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { isTokenExpired } from "../../utils/authUtils";
import FloatingNav from "../Common/FloatingNav";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { SERVER_URL } from "@/constants";

const RootLayout = () => {
    const logout = useAuthStore((state) => state.logout);
    const isAuth = useAuthStore((state) => state.isAuth);
    const userData = useAuthStore((state) => state.userData);
    const addNotification = useAuthStore((state) => state.addNotification);
    const location = useLocation();

    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            if (isTokenExpired(token)) {
                logout();
                localStorage.removeItem("token");
            }
        };
        checkAuth();
    }, [isAuth, logout]);

    useEffect(() => {
        if (!isAuth || !userData?._id) return;

        socket.current = io(SERVER_URL, {
            path: "/socket.io/",
            transports: ["websocket"],
        });

        socket.current.on("connect", () => {
            socket.current?.emit("addUser", userData._id);
        });

        socket.current.on("new_notification", (data) => {
            if (!location.pathname.includes(`/chat/${data.conversationId}`)) {
                addNotification();
                toast.info(`✉️ ${data.senderName}님으로부터 새 메시지가 도착했습니다!`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        });

        return () => {
            socket.current?.disconnect();
        };
    }, [isAuth, userData?._id, location.pathname, addNotification]);

    return (
        <>
            <Outlet />
            <FloatingNav />
        </>
    );
};

export default RootLayout;
