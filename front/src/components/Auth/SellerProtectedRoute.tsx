import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const SellerProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuth, userData } = useAuthStore();
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to="/login" replace={true} state={{ from: location }} />;
    }

    if (userData?.role !== "seller") {
        return <Navigate to="/" replace={true} />;
    }

    return children;
};

export default SellerProtectedRoute;
